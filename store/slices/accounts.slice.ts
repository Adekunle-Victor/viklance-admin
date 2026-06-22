import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "@/lib/accounts.types";
import { authFetch } from "@/lib/api";

interface AccountsState {
  items:   Account[];
  loading: boolean;
  error:   string | null;
}

const initialState: AccountsState = { items: [], loading: false, error: null };

export const fetchAccount = createAsyncThunk(
  "accounts/fetchOne",
  async (id: number, { rejectWithValue }) => {
    const res  = await authFetch(`/api/accounts/${id}`);
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Account;
  }
);

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAll",
  async (
    params: { status?: string; search?: string; assigned_to?: string } = {},
    { rejectWithValue }
  ) => {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ) as Record<string, string>;
    const query = new URLSearchParams(filtered).toString();
    const res   = await authFetch(`/api/accounts${query ? `?${query}` : ""}`);
    const data  = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Account[];
  }
);

export const createAccount = createAsyncThunk(
  "accounts/create",
  async (
    body: { name: string; contact_person?: string; phone?: string; email?: string; notes?: string; source?: string; product?: string },
    { rejectWithValue }
  ) => {
    const res  = await authFetch("/api/accounts", { method: "POST", body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Account;
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/update",
  async (
    { id, ...body }: { id: number; name?: string; contact_person?: string; phone?: string; email?: string; source?: string; product?: string },
    { rejectWithValue }
  ) => {
    const res  = await authFetch(`/api/accounts/${id}`, { method: "PATCH", body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Account;
  }
);

export const updateAccountStatus = createAsyncThunk(
  "accounts/updateStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/accounts/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Account;
  }
);

export const markAccountDemoReady = createAsyncThunk(
  "accounts/markDemoReady",
  async (
    { id, frontend_demo_url, admin_demo_url, demo_email, demo_password }: {
      id: number; frontend_demo_url: string; admin_demo_url: string;
      demo_email?: string; demo_password?: string;
    },
    { rejectWithValue }
  ) => {
    const res  = await authFetch(`/api/accounts/${id}/demo`, {
      method: "PATCH", body: JSON.stringify({ frontend_demo_url, admin_demo_url, demo_email, demo_password }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as { success: boolean; demo: Record<string, string> };
  }
);

export const sendAccountEmail = createAsyncThunk(
  "accounts/sendEmail",
  async (
    { id, type, message }: { id: number; type: "demo" | "proposal" | "followup"; message?: string },
    { rejectWithValue }
  ) => {
    const res  = await authFetch(`/api/accounts/${id}/email`, {
      method: "POST", body: JSON.stringify({ type, message }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as { success: boolean };
  }
);

export const updateAccountNotes = createAsyncThunk(
  "accounts/updateNotes",
  async ({ id, notes }: { id: number; notes: string }, { rejectWithValue }) => {
    const res  = await authFetch(`/api/accounts/${id}/notes`, { method: "PATCH", body: JSON.stringify({ notes }) });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Account;
  }
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const upsert = (state: AccountsState, a: Account) => {
      const idx = state.items.findIndex((x) => x.id === a.id);
      if (idx !== -1) state.items[idx] = a;
    };

    builder
      .addCase(fetchAccounts.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<Account[]>) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchAccounts.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(createAccount.fulfilled, (state, action: PayloadAction<Account>) => { state.items.unshift(action.payload); })
      .addCase(createAccount.rejected,  (state, action) => { state.error = action.payload as string; })
      .addCase(fetchAccount.fulfilled,        (state, action: PayloadAction<Account>) => { upsert(state, action.payload); })
      .addCase(updateAccount.fulfilled,       (state, action: PayloadAction<Account>) => { upsert(state, action.payload); })
      .addCase(updateAccountStatus.fulfilled, (state, action: PayloadAction<Account>) => { upsert(state, action.payload); })
      .addCase(updateAccountNotes.fulfilled,  (state, action: PayloadAction<Account>) => { upsert(state, action.payload); });
  },
});

export const { clearError } = accountsSlice.actions;
export default accountsSlice.reducer;
