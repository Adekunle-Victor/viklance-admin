import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Referrer } from "@/lib/referrals.types";
import { authFetch } from "@/lib/api";

interface ReferralsState {
  items:   Referrer[];
  loading: boolean;
  error:   string | null;
}

const initialState: ReferralsState = { items: [], loading: false, error: null };

export const fetchReferrers = createAsyncThunk(
  "referrals/fetchAll",
  async (_, { rejectWithValue }) => {
    const res  = await authFetch("/api/referrals");
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Referrer[];
  }
);

export const markReferrerPaid = createAsyncThunk(
  "referrals/markPaid",
  async (id: number, { rejectWithValue }) => {
    const res  = await authFetch(`/api/referrals/${id}/paid`, { method: "PATCH" });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Referrer;
  }
);

const referralsSlice = createSlice({
  name: "referrals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferrers.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReferrers.fulfilled, (state, action: PayloadAction<Referrer[]>) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchReferrers.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(markReferrerPaid.fulfilled, (state, action: PayloadAction<Referrer>) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], payout_status: "Paid" };
      });
  },
});

export default referralsSlice.reducer;
