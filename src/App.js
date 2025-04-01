import { useState } from "react";
import { format } from "date-fns";

export default function App() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", room: "", platform: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setError("");
    const exists = reservations.some(
      (r) => r.date === form.date && r.room.toLowerCase() === form.room.toLowerCase()
    );
    if (exists) {
      setError("중복 예약! 해당 날짜에 이미 예약이 있습니다.");
      return;
    }
    setReservations([...reservations, form]);
    setForm({ name: "", date: "", room: "", platform: "" });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>RoomSync - 예약 관리</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input placeholder="이름" name="name" value={form.name} onChange={handleChange} style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
        <input type="date" name="date" value={form.date} onChange={handleChange} style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
        <input placeholder="객실명" name="room" value={form.room} onChange={handleChange} style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
        <input placeholder="플랫폼 (예: 에어비앤비)" name="platform" value={form.platform} onChange={handleChange} style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleAdd}>예약 추가</button>
      </div>
      <div>
        {reservations.length === 0 ? (
          <p style={{ color: "gray" }}>등록된 예약이 없습니다.</p>
        ) : (
          reservations.map((r, i) => (
            <div key={i} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "0.5rem", marginBottom: "0.5rem" }}>
              <p><strong>{r.name}</strong> ({r.platform})</p>
              <p>{r.room} - {format(new Date(r.date), "yyyy-MM-dd")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
