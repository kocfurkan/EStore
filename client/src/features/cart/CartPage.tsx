import { Button, Grid, Typography } from "@mui/material";

import CartSummary from "./CartSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";

import CartTable from "./CartTable";

function CartPage() {
  const { cart } = useAppSelector((state) => state.cart);

  //function handleAddItem(productId: number, name: string) {
  //    setStatus({ loading: true, name });
  //    agent.Cart
  //        .addItem(productId)
  //        .then(cart => dispatch(setCart(cart)))
  //        .catch(error => console.log(error))
  //        .finally(() => setStatus({ loading: false, name }))
  //}

  //function handleRemove(productId: number, quantity = 1, name: string) {
  //    setStatus({ loading: true, name });
  //    agent.Cart.removeItem(productId, quantity)
  //        .then(() => dispatch(removeItem({productId, quantity})))
  //        .catch(error => console.log(error))
  //        .finally(() => setStatus({ loading: false, name }))
  //}

  if (!cart) return <Typography variant="h3">Your cart is empty</Typography>;
  return (
    <>
      <CartTable cartItems={cart.cartItems}></CartTable>
      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <CartSummary></CartSummary>
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CartPage;
