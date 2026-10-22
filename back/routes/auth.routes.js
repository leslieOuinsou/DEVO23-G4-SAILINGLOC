import express from "express";
import authController from "../controllers/auth.controller.js";
import { validateLogin, validateRegister, validateChangePassword, validateForgotPassword, validateResetPassword } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth/authorize.js";
import { csrfProtection } from "../middlewares/csrf.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Opérations d'authentification
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstname
 *               - lastname
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *               firstname:
 *                 type: string
 *                 example: Jean
 *               lastname:
 *                 type: string
 *                 example: Dupont
 *               isOwner:
 *                 type: boolean
 *                 example: false
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user"]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupérer l'utilisateur courant
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Utilisateur courant
 *       401:
 *         description: Non authentifié
 */

/**
 * @swagger
 * /auth/confirmation/{token}:
 *   get:
 *     summary: Confirmer l'email via token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Jeton de confirmation
 *     responses:
 *       200:
 *         description: Email confirmé
 *       400:
 *         description: Token invalide
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Changer le mot de passe
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               oldPassword:
 *                 type: string
 *                 example: ancienmotdepasse
 *               newPassword:
 *                 type: string
 *                 example: nouveaumotdepasse
 *     responses:
 *       200:
 *         description: Mot de passe changé
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */

/**
 * @swagger
 * /auth/forgot-password-email:
 *   post:
 *     summary: Envoyer un email de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *     responses:
 *       200:
 *         description: Email envoyé
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: nouveaumotdepasse
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Erreur de validation
 */

router.post("/login",  validateLogin, validate, authController.login);
router.post("/register", validateRegister, validate, authController.register);
router.get("/me", authController.getCurrentUser);
router.get("/confirmation/:token", authController.confirmEmail);
router.post("/change-password", csrfProtection,isAuthenticated, validateChangePassword, validate, authController.changePassword);
router.post("/forgot-password-email", csrfProtection, validateForgotPassword, validate, authController.forgotPasswordEmail);
router.post("/reset-password", csrfProtection, validateResetPassword, validate, authController.resetPassword);

export default router;