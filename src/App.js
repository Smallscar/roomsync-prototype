import { useEffect, useState } from "react";
import { format } from "date-fns";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function RoomSyncPrototype() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", room: "", platform: "" });
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [view, setView] = useState("main");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/reservations";

  const roomOptions = [
    "별관101호", "별관102호", "별관201호", "별관202호", "별관301호", "별관302호",
    "본관201호", "본관202호", "본관203호", "본관205호",
    "본관301호", "본관302호", "본관305호",
    "본관401호", "본관402호", "본관405호",
    "펜션 전체"
  ];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error("예약 데이터를 불러오는 데 실패했습니다.", err);
        setReservations([]);
      }
    };
    fetchReservations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.date || !form.room || !form.platform) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    const isDuplicate = reservations.some(
      r => r.date === form.date && r.room === form.room && r.id !== editId
    );
    if (isDuplicate) {
      setError("이미 해당 날짜에 해당 객실의 예약이 존재합니다.");
      return;
    }
    if (editId) {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editId })
      });
      const updated = await res.json();
      setReservations(prev => prev.map(r => r.id === editId ? updated : r));
      setEditId(null);
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const newRes = await res.json();
      setReservations(prev => [...prev, newRes]);
    }
    setForm({ name: "", date: "", room: "", platform: "" });
  };

  const handleEdit = (r) => {
    setForm({ name: r.name, date: r.date, room: r.room, platform: r.platform });
    setEditId(r.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold">RoomSync</h1>
      </div>

      <div className="border-b mb-8 flex justify-center gap-6">
        <button
          onClick={() => setView("main")}
          className={\`pb-2 border-b-2 transition-all duration-200 \${view === "main" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-blue-500"}\`}
        >
          예약 관리
        </button>
        <button
          onClick={() => setView("settings")}
          className={\`pb-2 border-b-2 transition-all duration-200 \${view === "settings" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-blue-500"}\`}
        >
          설정
        </button>
      </div>

      {view === "settings" ? (
        <div className="p-4 border rounded shadow-sm text-sm text-gray-600">
          <h2 className="text-lg font-semibold mb-2">설정</h2>
          <p>여기서 나중에 플랫폼 색상이나 필터 옵션을 넣을 수 있어요.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          <div>
            <div className="border rounded p-4 mb-4 shadow-sm">
              <input className="w-full border p-2 mb-2 rounded" placeholder="이름" name="name" value={form.name} onChange={handleChange} />
              <input className="w-full border p-2 mb-2 rounded" type="date" name="date" value={form.date} onChange={handleChange} />
              <select className="w-full border p-2 mb-2 rounded" name="room" value={form.room} onChange={handleChange}>
                <option value="">객실 선택</option>
                {roomOptions.map((room, idx) => (
                  <option key={idx} value={room}>{room}</option>
                ))}
              </select>
              <input className="w-full border p-2 mb-2 rounded" placeholder="플랫폼 (예: 에어비앤비)" name="platform" value={form.platform} onChange={handleChange} />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={handleSubmit}>
                {editId ? "예약 수정" : "예약 추가"}
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {reservations.map(r => (
                <div key={r.id} className="border p-2 rounded flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <strong>{r.name}</strong> | {r.room} | {r.date} | {r.platform}
                  </div>
                  <div className="space-x-2 text-right">
                    <button className="text-blue-500" onClick={() => handleEdit(r)}>수정</button>
                    <button className="text-red-500" onClick={() => handleDelete(r.id)}>삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded shadow-sm p-4 overflow-x-auto">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={reservations.filter(r => r.date && r.name && r.room).map(r => ({
                title: `${r.room} - ${r.name}`,
                date: r.date
              }))}
              height="auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
