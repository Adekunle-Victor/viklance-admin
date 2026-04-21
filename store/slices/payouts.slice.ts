import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Payout } from "@/lib/payouts.types";
import { authFetch } from "@/lib/api";

interface PayoutsState {
  items:   Payout[];
  loading: boolean;
  error:   string | null;
}

const initialState: PayoutsState = { items: [], loading: false, error: null };

export const fetchPayouts = createAsyncThunk(
  "payouts/fetchAll",
  async (status: string | undefined = undefined, { rejectWithValue }) => {
    const query = status ? `?status=${status}` : "";
    const res   = await authFetch(`/api/payouts${query}`);
    const data  = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data;
  }
);

export const updatePayoutStatus = createAsyncThunk(
  "payouts/updateStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/payouts/${id}/status`, {
      method: "PATCH",
      body:   JSON.stringify({ status }),
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
