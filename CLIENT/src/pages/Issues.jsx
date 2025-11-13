// // pages>Issues.jsx
// import React, { useEffect, useState } from "react";
// import IssueCard from "../components/IssueCard";
// import { useSelector, useDispatch } from "react-redux";
// // import axios from "axios";
// import { fetchMyIssues, createIssue } from "../features/issues/issueSlice";

// export default function Issues() {
//     const dispatch = useDispatch();
//     const user = useSelector((state) => state.auth.user);
//     const { list, loading } = useSelector((state) => state.issues);

//     const [formOpen, setFormOpen] = useState(false);
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [imageUrl, setImageUrl] = useState("");

//     // const mockIssues = [
//     //     { title: "נזילה בחדר מדרגות", date: "2025-11-01", reporter: "רות כהן", status: "פתוחה" },
//     //     { title: "תאורה בחניה", date: "2025-11-05", reporter: "דני לוי", status: "בטיפול" },
//     //     { title: "שער כניסה תקוע", date: "2025-11-09", reporter: "מיכל ברק", status: "הושלמה" }
//     // ];

//     useEffect(() => {
//         dispatch(fetchMyIssues());
//     }, [dispatch]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(
//             createIssue({
//                 userId: user._id,
//                 title,
//                 description,
//                 imageUrl,
//             })
//         ).then(() => {
//             setTitle("");
//             setDescription("");
//             setImageUrl("");
//             setFormOpen(false);
//         });
//     };

//     return (
//         // <div>
//         //     <h1 style={{ marginBottom: 12 }}>ניהול תקלות</h1>

//         //     {user?.role === "admin" && (
//         //         <div style={{ marginBottom: 12 }}>
//         //             <button className="btn btn-primary">הוסף תקלה חדשה</button>
//         //         </div>
//         //     )}

//         //     <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
//         //         {mockIssues.map((it, i) => <IssueCard key={i} {...it} />)}
//         //     </div>
//         // </div>
//         <div>
//             <h1 style={{ marginBottom: 12 }}>התקלות שלי</h1>

//             <button className="btn btn-primary" onClick={() => setFormOpen(!formOpen)}>
//                 {formOpen ? "ביטול" : "דווח על תקלה חדשה"}
//             </button>

//             {formOpen && (
//                 <form onSubmit={handleSubmit} style={{ marginTop: 16, marginBottom: 24 }}>
//                     <div className="form-group">
//                         <label>כותרת התקלה</label>
//                         <input
//                             className="input"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>תיאור</label>
//                         <textarea
//                             className="input"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             rows={3}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>תמונה (כתובת URL)</label>
//                         <input
//                             className="input"
//                             value={imageUrl}
//                             onChange={(e) => setImageUrl(e.target.value)}
//                         />
//                     </div>
//                     <button className="btn btn-primary" type="submit">
//                         שלח דיווח
//                     </button>
//                 </form>
//             )}

//             {loading ? (
//                 <p>טוען...</p>
//             ) : (
//                 <div
//                     style={{
//                         display: "grid",
//                         gap: 12,
//                         gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
//                     }}
//                 >
//                     {list.map((it, i) => (
//                         <IssueCard
//                             key={i}
//                             title={it.title}
//                             date={it.createdAt}
//                             reporter={user.fullName}
//                             status={it.status}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }


// 👇00000000000000000000000
// import React from "react";
// import IssueCard from "../components/IssueCard";
// import { useSelector } from "react-redux";
// export default function Issues() {
//     const user = useSelector((state) => state.auth.user);
//     const mockIssues = [
//         { title: "נזילה בחדר מדרגות", date: "2025-11-01", reporter: "רות כהן", status: "פתוחה" },
//         { title: "תאורה בחניה", date: "2025-11-05", reporter: "דני לוי", status: "בטיפול" },
//         { title: "שער כניסה תקוע", date: "2025-11-09", reporter: "מיכל ברק", status: "תוקנה" }
//     ];
//     return (
//         <div>
//             <h1 style={{ marginBottom: 12 }}>ניהול תקלות</h1>
//             {user?.role != "admin" && (
//                 <div style={{ marginBottom: 12 }}>
//                     <button className="btn btn-primary">הוסף תקלה חדשה</button>
//                 </div>
//             )}
//             <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
//                 {mockIssues.map((it, i) => <IssueCard key={i} {...it} />)}
//             </div>
//         </div>
//     );
// }

// 👇👇VVVVVV
import React, { useEffect } from "react";
import IssueCard from "../components/IssueCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyIssues } from "../features/issues/issuesSlice";

export default function Issues() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.issues);
    const user = useSelector((state) => state.auth.user);

    // useEffect(() => {
    //     if (user?.id) dispatch(fetchMyIssues(user.id));
    // }, [dispatch, user]);

    useEffect(() => {
        const testUserId = "690bb129150027b72da5891a";
        dispatch(fetchMyIssues(testUserId));
    }, [dispatch]);


    if (loading) return <p>טוען...</p>;
    if (error) return <p>שגיאה: {error}</p>;

    // const mockIssues = [
    //     { title: "נזילה בחדר מדרגות", date: "2025-11-01", reporter: "רות כהן", status: "פתוחה" },
    //     { title: "תאורה בחניה", date: "2025-11-05", reporter: "דני לוי", status: "בטיפול" },
    //     { title: "שער כניסה תקוע", date: "2025-11-09", reporter: "מיכל ברק", status: "תוקנה" }
    // ];

    return (
        <div>
            <h1 style={{ marginBottom: 12 }}>ניהול תקלות</h1>
            {user?.role != "admin" && (
                <div style={{ marginBottom: 12 }}>
                    <button className="btn btn-primary">הוסף תקלה חדשה</button>
                </div>
            )}
            {/* <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
                {mockIssues.map((it, i) => <IssueCard key={i} {...it} />)}
            </div> */}
            <div style={{
                display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))"
            }}>
                {list.map((it, i) => <IssueCard key={i} {...it} />)}
            </div>
        </div>
    );
}