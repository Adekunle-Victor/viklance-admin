import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Payout } from "@/lib/payouts.types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface PayoutsState {
  items:   Payout[];
  loading: boolean;
  error:   string | null;
}

const initialState: PayoutsState = { items: [], loading: false, error: null };

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const fetchPayouts = createAsyncThunk(
  "payouts/fetchAll",
  async (status: string | undefined = undefined, { rejectWithValue }) => {
    const query = status ? `?status=${status}` : "";
    const res   = await fetch(`${API}/api/payouts${query}`, { headers: authHeader() });
    const data  = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

export const updatePayoutStatus = createAsyncThunk(
  "payouts/updateStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    const res  = await fetch(`${API}/api/payouts/${id}/status`, {
      method:  "PATCH",
      headers: authHeader(),
      body:    JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

const payoutsSlice = createSlice({
  name: "payouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayouts.pending,  (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPayouts.fulfilled, (state, action: PayloadAction<Payout[]>) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(updatePayoutStatus.fulfilled, (state, action: PayloadAction<Payout>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default payoutsSlice.reducer;
