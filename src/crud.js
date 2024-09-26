import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import "./crud.css";

const Crud = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [major, setMajor] = useState("");
  const [fetchData, setFetchData] = useState([]);
  const [id, setId] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho tìm kiếm

  const dbref = collection(db, "students");

  const add = async () => {
    if (
      !name ||
      !major ||
      age <= 0 ||
      (gender !== "Male" && gender !== "Female")
    ) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin");
      return;
    }

    try {
      await addDoc(dbref, {
        name: name,
        age: parseInt(age),
        gender: gender,
        major: major,
      });
      alert("Thêm sinh viên thành công");
      resetForm();
      fetch();
    } catch (error) {
      alert("Lỗi khi thêm sinh viên: ", error);
    }
  };

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

  const passData = async (id) => {
    try {
      const docRef = doc(db, "students", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setAge(docSnap.data().age);
        setGender(docSnap.data().gender);
        setMajor(docSnap.data().major);
        setId(id);
      } else {
        alert("Không tìm thấy sinh viên này");
      }
    } catch (error) {
      alert("Lỗi khi lấy thông tin sinh viên: ", error);
    }
  };

  const update = async () => {
    if (
      !name ||
      !major ||
      age <= 0 ||
      (gender !== "Male" && gender !== "Female")
    ) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin");
      return;
    }

    try {
      const docRef = doc(db, "students", id);
      await updateDoc(docRef, {
        name: name,
        age: parseInt(age),
        gender: gender,
        major: major,
      });
      alert("Cập nhật thông tin sinh viên thành công");
      fetch();
      resetForm();
    } catch (error) {
      alert("Lỗi khi cập nhật thông tin sinh viên: ", error);
    }
  };

  const del = async (id) => {
    try {
      const docRef = doc(db, "students", id);
      await deleteDoc(docRef);
      alert("Xóa sinh viên thành công");
      fetch();
    } catch (error) {
      alert("Lỗi khi xóa sinh viên: ", error);
    }
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setGender("");
    setMajor("");
    setId("");
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = fetchData.filter((data) =>
    data.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="a">
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
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="box">
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="box">
            <input
              type="text"
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>
          <button onClick={add}>Thêm sinh viên</button>
          <button onClick={update} disabled={!id}>
            Cập nhật sinh viên
          </button>
        </div>
      </div>

      <div className="search_container">
        <h2>Tìm kiếm sinh viên</h2>
        <input
          type="text"
          placeholder="Tìm sinh viên theo id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="database">
        <h2>Danh sách sinh viên</h2>
        <div className="container">
          {filteredData.map((data) => (
            <div key={data.id} className="box">
              <h3>Họ và tên: {data.name}</h3>
              <h3>Tuổi: {data.age}</h3>
              <h3>Giới tính: {data.gender}</h3>
              <h3>Ngành học: {data.major}</h3>
              <h3>ID: {data.id}</h3>
              <button
                style={{ marginBottom: "10" }}
                onClick={() => passData(data.id)}
              >
                Edit
              </button>
              <button onClick={() => del(data.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Crud;
