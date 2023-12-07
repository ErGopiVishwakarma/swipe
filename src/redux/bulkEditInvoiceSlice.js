import { createSlice } from "@reduxjs/toolkit";

const editInvoicesSlice = createSlice({
    name: "editInvoices",
    initialState: [],
    reducers: {
        addInvoiceForEdit: (state, action) => {
            state.push(action.payload);
        },
        removeAllEditedInvoice: (state, action) => {
            return []
        },
        removeOneEditableInvoice: (state, action) => {
            return state.filter((invoice) => parseInt(invoice.id) !== parseInt(action.payload));
        },
        updateEditedInvoice: (state, action) => {
            const index = state.findIndex(
                (invoice) => invoice.id === action.payload.id
            );
            if (index !== -1) {
                state[index] = action.payload.updatedItem;
            }
        },
    },
});

export const {
    addInvoiceForEdit,
    removeAllEditedInvoice,
    removeOneEditableInvoice,
    updateEditedInvoice
} = editInvoicesSlice.actions;

export const selectEditInvoiceList = (state) => state.editInvoices;

export default editInvoicesSlice.reducer;
