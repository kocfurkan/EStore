import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableFooter, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";
export default function ProductDetails() {

    const { id } = useParams<{ id: string }>();

    const { cart, setCart, removeItem } = useStoreContext();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const item = cart?.cartItems.find(x => x.productId === product?.id);


    useEffect(() => {

        if (item) {
            setQuantity(item.quantity);
        }

        id && agent.Catalog.details(parseInt(id))
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [id, item])


    function handleInputChange(event: any) {
        if (event.target.value >= 0) {
            setQuantity(parseInt(event.target.value))
        }
    }

    function handleUpdateCart() {
        setSubmitting(true);
        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            agent.Cart.addItem(product?.id!, updatedQuantity)
                .then(cart => setCart(cart))
                .catch(error => console.log(error))
                .finally(() => setSubmitting(false))
        } else {
            const updatedQuantity = item.quantity - quantity;
            agent.Cart.removeItem(product?.id!, updatedQuantity)
                .then(() => removeItem(product?.id!, updatedQuantity))
                .catch((error) => console.log(error))
                .finally(() => setSubmitting(false))
        }
    }

    if (loading) return <LoadingComponent message='Loading product...'></LoadingComponent>
    if (!product) return <NotFound></NotFound>

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }}></img>
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'> {product.name}</Typography>
                <Divider sx={{ mb: 3, mt: 1 }}></Divider>
                <Typography variant='h4' color='secondary' sx={{ ml: 1 }}>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>

                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell> {product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell> {product.description}</TableCell></TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell> {product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell> {product.brand}</TableCell></TableRow>
                            <TableRow>
                                <TableCell>Quantity</TableCell>
                                <TableCell> {product.quantityInStock}</TableCell></TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell >
                                </TableCell>
                                <TableCell align="right" >
                                    All Rights Reserved
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <TextField type='number' variant='outlined' label=' Quantity in Cart' fullWidth value={quantity} onChange={handleInputChange} >
                        </TextField></Grid>
                    <Grid item xs={6}>
                        <LoadingButton disabled={item?.quantity === quantity || !item && quantity === 0} loading={submitting} onClick={handleUpdateCart} sx={{ height: '55px' }} color='primary' size='large' variant='contained' fullWidth>
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton></Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}