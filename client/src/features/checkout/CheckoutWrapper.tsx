import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setCart } from "../cart/cartSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";

const stripePromise = loadStripe(
  "pk_test_51OVKqiLDfbJS2z4p3OH94t6NLcORvZQhLFDCUmrrITIDVs2Bmb8ZpxXhsh8jWxZFtSUKP3i1hPoEinhxts9a9R2Y00fUoiFgF0"
);

export default function CheckoutWrapper() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Payments.createPaymentIntent()
      .then((response) => dispatch(setCart(response)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <LoadingComponent message="Loading checkout" />;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}
