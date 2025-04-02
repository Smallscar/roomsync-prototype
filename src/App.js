import { useEffect, useState } from "react";
import { format } from "date-fns";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

export default function RoomSyncPrototype() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", room: "", platform: "" });
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:4000/reservations";

  const roomOptions = [
    "별관101호", "별관102호", "별관201호", "별관202호", "별관301호", "별관302호",
    "본관201호", "본관202호", "본관203호", "본관205호",
    "본관301호", "본관302호", "본관305호",
    "본관401호", "본관402호", "본관405호",
    "펜션 전체"
  ];

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setReservations(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setError("");
    const exists = reservations.some(
      (r) => r.date === form.date && r.room.toLowerCase() === form.room.toLowerCase() && r.id !== editId
    );
    if (exists) {
      setError("중복 예약! 해당 날짜에 이미 예약이 있습니다.");
      return;
    }

    if (editId !== null) {
      const updated = { ...form, id: editId };
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      setReservations(prev => prev.map(r => (r.id === editId ? updated : r)));
      setEditId(null);
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const newRes = await res.json();
      setReservations([...reservations, newRes]);
    }

    setForm({ name: "", date: "", room: "", platform: "" });
  };

  const handleEdit = (reservation) => {
    setForm(reservation);
    setEditId(reservation.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setReservations(reservations.filter(r => r.id !== id));
    if (editId === id) {
      setForm({ name: "", date: "", room: "", platform: "" });
      setEditId(null);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RoomSync - 예약 관리</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="border rounded p-4 mb-4 shadow-sm">
            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="이름"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2 mb-2 rounded"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
            <select
              name="room"
              value={form.room}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            >
              <option value="">객실 선택</option>
              {roomOptions.map((room, idx) => (
                <option key={idx} value={room}>{room}</option>
              ))}
            </select>
            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="플랫폼 (예: 에어비앤비)"
              name="platform"
              value={form.platform}
              onChange={handleChange}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              onClick={handleAdd}
            >
              {editId !== null ? "예약 수정" : "예약 추가"}
            </button>
          </div>

          <div className="space-y-2">
            {reservations.length === 0 ? (
              <p className="text-gray-500">등록된 예약이 없습니다.</p>
            ) : (
              reservations.map((r) => (
                <div key={r.id} className="border rounded p-3 shadow-sm">
                  <p><strong>{r.name}</strong> ({r.platform})</p>
                  <p>{r.room} - {format(new Date(r.date), "yyyy-MM-dd")}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-sm text-blue-600 border border-blue-600 rounded px-2 py-1 hover:bg-blue-50"
                    >수정</button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-sm text-red-600 border border-red-600 rounded px-2 py-1 hover:bg-red-50"
                    >삭제</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border rounded shadow-sm p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={reservations.map(r => ({
              title: `${r.room} - ${r.name}`,
              date: r.date
            }))}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}