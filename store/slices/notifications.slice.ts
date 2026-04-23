import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/lib/notifications.types";
import { authFetch } from "@/lib/api";

interface NotificationsState {
  items:   Notification[];
  loading: boolean;
}

const initialState: NotificationsState = { items: [], loading: false };

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    const res  = await authFetch("/api/notifications");
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Notification[];
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id: number, { rejectWithValue }) => {
    const res  = await authFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data as Notification;
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    const res = await authFetch("/api/notifications/read-all", { method: "PATCH" });
    if (!res.ok) return rejectWithValue("Failed");
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending,   (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchNotifications.rejected,  (state) => { state.loading = false; })
      .addCase(markNotificationRead.fulfilled, (state, action: PayloadAction<Notification>) => {
        const idx = state.items.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
      });
  },
});

export default notificationsSlice.reducer;
