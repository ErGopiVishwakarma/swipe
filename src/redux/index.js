import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; // Import your other reducers
import editableInvoiceReducer from './bulkEditInvoiceSlice'

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  editInvoices: editableInvoiceReducer
});

export default rootReducer;
