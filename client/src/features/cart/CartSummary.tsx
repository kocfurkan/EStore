import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { currencyFormat } from "../../app/util/util";
import { useAppSelector } from "../../app/store/configureStore";

export default function CartSummary() {
    const { cart } = useAppSelector(state => state.cart);

    let deliveryFee = 0;
    const subtotal = cart ? cart?.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0) : 0;
    if (cart && cart?.cartItems.length > 0) {
         deliveryFee = subtotal > 10000 ? 0 : 500;
    }
   


    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}