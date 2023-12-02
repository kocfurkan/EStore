
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import CartSummary from "./CartSummary";
import { Link } from "react-router-dom";


function CartPage() {

    const { cart, setCart, removeItem } = useStoreContext();
    const [status, setStatus] = useState({
        loading: false, name: ''
    })

    function handleAddItem(productId: number, name: string) {
        setStatus({ loading: true, name });
        agent.Cart
            .addItem(productId)
            .then(cart => setCart(cart))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, name }))
    }

    function handleRemove(productId: number, quantity = 1, name: string) {
        setStatus({ loading: true, name });
        agent.Cart.removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, name }))
    }

    if (!cart) return <Typography variant='h3'>Your cart is empty</Typography>
    return (
        <>
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
                                    <LoadingButton onClick={() => handleRemove(item.productId, 1, 'rem' + item.productId)} loading=
                                        {status.loading && status.name === 'rem' + item.productId} color='error'> <Remove></Remove></LoadingButton>
                                    {item.quantity}
                                    <LoadingButton loading=
                                        {status.loading && status.name === 'add' + item.productId} onClick={() => handleAddItem(item.productId, 'add' + item.productId)} color='secondary'> <Add></Add></LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(item.price / 100 * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton loading={status.loading && status.name === 'remall' + item.productId} onClick={() => handleRemove(item.productId, item.quantity, 'remall' + item.productId)} color='error'>
                                        <Delete></Delete>
                                    </LoadingButton></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6}>
                    <CartSummary>
                    </CartSummary>
                    <Button component={Link} to='/checkout' variant='contained' size='large' fullWidth>Checkout</Button>
                </Grid>
            </Grid>
        </>

    );
}

export default CartPage;