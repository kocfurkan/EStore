
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


function CartPage() {

    const { cart, setCart, removeItem } = useStoreContext();
    const [loading, setLoading] = useState(false)

    function handleAddItem(productId: number) {
        setLoading(true);
        agent.Cart
            .addItem(productId)
            .then(cart => setCart(cart))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }

    function handleRemove(productId: number, quantity = 1) {
        setLoading(true);
        agent.Cart.removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }

    if (!cart) return <Typography variant='h3'>Your cart is empty</Typography>
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} >
                <TableHead>
                    <TableRow>
                        <TableCell>Products</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cart.cartItems.map((item) => (
                        <TableRow
                            key={item.productId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Box display='flex' alignItems='center'>
                                    <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }}></img>
                                    <span>{item.name}</span></Box>
                            </TableCell>
                            <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <LoadingButton onClick={() => handleRemove(item.productId)} loading=
                                    {loading} color='error'> <Remove></Remove></LoadingButton>
                                {item.quantity}
                                <LoadingButton loading={loading} onClick={() => handleAddItem(item.productId)} color='secondary'> <Add></Add></LoadingButton>
                            </TableCell>
                            <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton loading={loading} onClick={() => handleRemove(item.productId, item.quantity)} color='error'>
                                    <Delete></Delete>
                                </LoadingButton></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CartPage;