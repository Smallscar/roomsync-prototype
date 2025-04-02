import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function RoomSyncPrototype() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", room: "", platform: "" });
  const [error, setError] = useState("");

  // 미리 등록된 객실 목록
  const roomOptions = ["별관101호", "별관102호", "별관201호", "별관202호", "별관301호", "별관302호", "본관201호", "본관202호", "본관203호", "본관205호", "본관301호", "본관302호", "본관305호", "본관401호", "본관402호", "본관405호","펜션 전체"];

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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">RoomSync - 예약 관리</h1>

      <Card className="mb-4">
        <CardContent className="space-y-2">
          <Input
            placeholder="이름"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          <select
            name="room"
            value={form.room}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">객실 선택</option>
            {roomOptions.map((room, idx) => (
              <option key={idx} value={room}>{room}</option>
            ))}
          </select>
          <Input
            placeholder="플랫폼 (예: 에어비앤비)"
            name="platform"
            value={form.platform}
            onChange={handleChange}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleAdd}>예약 추가</Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {reservations.length === 0 ? (
          <p className="text-gray-500">등록된 예약이 없습니다.</p>
        ) : (
          reservations.map((r, i) => (
            <Card key={i}>
              <CardContent>
                <p><strong>{r.name}</strong> ({r.platform})</p>
                <p>{r.room} - {format(new Date(r.date), "yyyy-MM-dd")}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
