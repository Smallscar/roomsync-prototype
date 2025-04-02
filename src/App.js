
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RoomSync</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="border rounded p-4 mb-4 shadow-sm">
            <input className="w-full border p-2 mb-2 rounded" placeholder="이름" />
            <input className="w-full border p-2 mb-2 rounded" type="date" />
            <select className="w-full border p-2 mb-2 rounded">
              <option>객실 선택</option>
              {roomOptions.map((room, idx) => (
                <option key={idx} value={room}>{room}</option>
              ))}
            </select>
            <input className="w-full border p-2 mb-2 rounded" placeholder="플랫폼 (예: 에어비앤비)" />
            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">예약 추가</button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">예약 리스트 출력 예정</div>
        </div>
        <div className="border rounded shadow-sm p-4">
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
    </div>
  );
}
