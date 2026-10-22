import db from "../models/index.js";
const { Payment, Reservation } = db;
import Stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config();

let stripeClient;
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!stripeClient) {
    stripeClient = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

const getAllPayments = async () => {
    return await Payment.findAll({
        include: Reservation
    });
};

const createPayment = async (data) => {
    return await Payment.create(data);
};

const getPaymentById = async (id) => {
    return await Payment.findByPk(id, {
        include: Reservation
    });
};

const updatePayment = async (id, data) => {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;
    return await payment.update(data);
};

const deletePayment = async (id) => {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;
    await payment.destroy();
    return true;
};

const getReservationPayments = async (reservationId) => {
    return await Payment.findAll({
        where: { reservation_id: reservationId },
        include: Reservation
    });
};

const createIntent = async (amount) => {
  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: "eur",
  });
  return paymentIntent.client_secret;
};

export default {
    getAllPayments,
    createPayment,
    getPaymentById,
    updatePayment,
    deletePayment,
    getReservationPayments,
    createIntent
};