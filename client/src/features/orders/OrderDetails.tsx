import { Box, Button, Grid, Typography } from "@mui/material";
import { Order } from "../../app/models/order";
import CartSummary from "../cart/CartSummary";
import CartTable from "../cart/CartTable";
import { CartItem } from "../../app/models/basket";

interface Props {
  order: Order;
  setSelectedOrder: (id: number) => void;
}

export default function OrderDetails({ order, setSelectedOrder }: Props) {
  const subtotal =
    order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Order# {order.id} - {order.orderStatus}
        </Typography>
        <Button
          onClick={() => setSelectedOrder(0)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Back to orders
        </Button>
      </Box>
      <CartTable cartItems={order.orderItems as CartItem[]} isCart={false} />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <CartSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </>
  );
}
