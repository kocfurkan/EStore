import { Grid, Typography } from "@mui/material";
import CartSummary from "../cart/CartSummary";
import CartTable from "../cart/CartTable";
import { useAppSelector } from "../../app/store/configureStore";

export default function Review() {
  const { cart } = useAppSelector((state) => state.cart);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {cart && (
        <CartTable cartItems={cart.cartItems} isCart={false}></CartTable>
      )}
      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <CartSummary></CartSummary>
        </Grid>
      </Grid>
    </>
  );
}
