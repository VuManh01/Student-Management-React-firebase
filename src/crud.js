import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import "./crud.css";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

const Crud = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(""); // Môn học
  const [classRoom, setClassRoom] = useState(""); // Lớp học
  const [fetchData, setFetchData] = useState([]);
  const [id, setId] = useState("");
  const [searchId, setSearchId] = useState(""); // Lưu ID tìm kiếm

  // Tạo tham chiếu đến bộ sưu tập "students" trong Firebase
  const dbref = collection(db, "students");

  // Thêm sinh viên mới vào Firebase
  const add = async () => {
    try {
      await addDoc(dbref, {
        name: name,
        phone: phone,
        subject: subject, // Thêm môn học
        classRoom: classRoom, // Thêm lớp học
      });
      alert("Thêm sinh viên thành công");
      // Reset form
      setName("");
      setPhone("");
      setSubject("");
      setClassRoom("");
      fetch(); // Cập nhật danh sách sau khi thêm
    } catch (error) {
      alert("Lỗi khi thêm sinh viên: ", error);
    }
  };

  // Lấy danh sách sinh viên từ Firebase
  const fetch = async () => {
    try {
      const snapshot = await getDocs(dbref);
      const fetchdata = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFetchData(fetchdata);
    } catch (error) {
      alert("Lỗi khi lấy danh sách sinh viên: ", error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Lấy thông tin chi tiết của một sinh viên theo ID
  const passData = async (id) => {
    try {
      const docRef = doc(db, "students", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setPhone(docSnap.data().phone);
        setSubject(docSnap.data().subject); // Gán môn học
        setClassRoom(docSnap.data().classRoom); // Gán lớp học
        setId(id); // Lưu lại ID để cập nhật
      } else {
        alert("Không tìm thấy sinh viên này");
      }
    } catch (error) {
      alert("Lỗi khi lấy thông tin sinh viên: ", error);
    }
  };

  // Cập nhật thông tin sinh viên theo ID
  const update = async () => {
    try {
      const docRef = doc(db, "students", id);
      await updateDoc(docRef, {
        name: name,
        phone: phone,
        subject: subject, // Cập nhật môn học
        classRoom: classRoom, // Cập nhật lớp học
      });
      alert("Cập nhật thông tin sinh viên thành công");
      fetch(); // Cập nhật danh sách sau khi cập nhật
      setId(""); // Reset lại ID
    } catch (error) {
      alert("Lỗi khi cập nhật thông tin sinh viên: ", error);
    }
  };

  // Xóa sinh viên theo ID
  const del = async (id) => {
    try {
      const docRef = doc(db, "students", id);
      await deleteDoc(docRef);
      alert("Xóa sinh viên thành công");
      fetch(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      alert("Lỗi khi xóa sinh viên: ", error);
    }
  };

  // Tìm sinh viên theo ID từ API
  const searchStudentById = async () => {
    try {
      const docRef = doc(db, "students", searchId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        alert(`Thông tin sinh viên: 
          Họ và tên: ${docSnap.data().name}
          Số điện thoại: ${docSnap.data().phone}
          Môn học: ${docSnap.data().subject}
          Lớp học: ${docSnap.data().classRoom}`);
      } else {
        alert("Không tìm thấy sinh viên này");
      }
      // Reset trường nhập ID
      setSearchId("");
    } catch (error) {
      alert("Lỗi khi tìm kiếm sinh viên: ", error);
      // Reset trường nhập ID nếu xảy ra lỗi
      setSearchId("");
    }
  };

  return (
    <div>
      <div className="form_container">
        <h2>ADD/ UPDATE FORM</h2>
        <div className="form_row">
          <div className="box">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="box">
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="\d{0,10}" /* Chỉ cho phép tối đa 10 chữ số */
              title="Số điện thoại tối đa 10 chữ số"
              maxLength="10" /* Giới hạn độ dài tối đa của trường nhập */
            />
          </div>

          <div className="box">
            <input
              type="text"
              placeholder="Class"
              value={classRoom}
              onChange={(e) => setClassRoom(e.target.value)}
            />
          </div>
          <div className="box">
            <input
              type="text"
              placeholder="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <button onClick={add}>Thêm sinh viên</button>
          <button onClick={update} disabled={!id}>
            Cập nhật sinh viên
          </button>
        </div>

        <div className="search_section">
          <input
            type="text"
            placeholder="Nhập ID sinh viên"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={searchStudentById}>Tìm sinh viên qua ID</button>
        </div>
      </div>

      <div className="database">
        <h2>Danh sách sinh viên</h2>
        <div className="container">
          {fetchData.map((data) => (
            <div key={data.id} className="box">
              <div>
                <h3>Họ và tên: {data.name}</h3>
              </div>
              <div>
                <h3>Số điện thoại: {data.phone}</h3>
              </div>
              <div>
                <h3>Môn học: {data.subject}</h3>
              </div>
              <div>
                <h3>Lớp học: {data.classRoom}</h3>
              </div>
              <div>
                <h3> ID: {data.id}</h3>
              </div>
              <div>
                <button onClick={() => passData(data.id)}>Edit</button>
                <button onClick={() => del(data.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Crud;
