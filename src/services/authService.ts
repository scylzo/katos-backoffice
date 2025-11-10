import type { User } from 'firebase/auth';
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { FirebaseUser } from '../types/firebase';
import { UserRole } from '../types/roles';

export class AuthService {
  async signIn(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  async signUp(
    email: string,
    password: string,
    displayName: string,
    role: UserRole = UserRole.CLIENT,
    phoneNumber?: string
  ): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await updateProfile(user, { displayName });

    const userData: FirebaseUser = {
      uid: user.uid,
      email: user.email!,
      displayName,
      phoneNumber: phoneNumber || null,
      role,
      createdAt: Timestamp.now()
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    return user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  async getUserData(uid: string): Promise<FirebaseUser | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() as FirebaseUser : null;
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Écouter les changements d'état d'authentification
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Changer le mot de passe de l'utilisateur connecté
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'Aucun utilisateur connecté'
        };
      }

      if (!user.email) {
        return {
          success: false,
          error: 'Email utilisateur non disponible'
        };
      }

      console.log('Tentative de ré-authentification pour:', user.email);

      // Ré-authentifier l'utilisateur avec son mot de passe actuel
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      console.log('Ré-authentification réussie, changement de mot de passe...');

      // Changer le mot de passe
      await updatePassword(user, newPassword);

      // Marquer que le mot de passe n'est plus temporaire (seulement si nécessaire)
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isTemporaryPassword) {
            await setDoc(doc(db, 'users', user.uid), {
              ...userData,
              isTemporaryPassword: false
            });
          }
        }
      } catch (firestoreError) {
        // Ignorer les erreurs Firestore pour ne pas empêcher le changement de mot de passe
        console.warn('Impossible de mettre à jour le flag isTemporaryPassword:', firestoreError);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);

      let errorMessage = 'Erreur lors du changement de mot de passe';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe actuel incorrect';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le nouveau mot de passe est trop faible';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Générer un mot de passe temporaire
  generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Créer un compte client avec mot de passe temporaire
  async createClientAccount(
    email: string,
    clientName: string,
    clientId: string
  ): Promise<{ success: boolean; tempPassword?: string; uid?: string; error?: string }> {
    try {
      const tempPassword = this.generateTemporaryPassword();

      // Sauvegarder l'utilisateur actuel (admin)
      const currentUser = auth.currentUser;
      const currentUserEmail = currentUser?.email;

      if (!currentUser || !currentUserEmail) {
        return {
          success: false,
          error: 'Aucun utilisateur admin connecté'
        };
      }

      // Créer le compte Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, tempPassword);
      const user = result.user;

      // Mettre à jour le profil
      await updateProfile(user, { displayName: clientName });

      // Créer le document utilisateur
      const userData: FirebaseUser = {
        uid: user.uid,
        email: user.email!,
        displayName: clientName,
        role: UserRole.CLIENT,
        createdAt: Timestamp.now(),
        clientId: clientId,
        isTemporaryPassword: true // Marquer comme mot de passe temporaire
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // Se déconnecter du compte client qui vient d'être créé
      await signOut(auth);

      // Remarque : L'admin devra se reconnecter
      // Dans une vraie application, nous utiliserions l'Admin SDK ou une Cloud Function

      return {
        success: true,
        tempPassword,
        uid: user.uid
      };
    } catch (error: any) {
      console.error('Erreur lors de la création du compte client:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const authService = new AuthService();