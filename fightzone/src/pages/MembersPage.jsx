import React, { useEffect, useState } from "react";
import { fetchUsers, fetchClubs, fetchCurrentUser } from "../services/api";
import { Link } from "react-router-dom";
import "../assets/styles/pages/MembersPage.css";

const MembersPage = () => {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, clubsData, currentUser] = await Promise.all([
          fetchUsers(),
          fetchClubs(),
          fetchCurrentUser(),
        ]);
        setUsers(usersData);
        setClubs(clubsData);
        setTrainer(currentUser.role === "Trainer" ? currentUser : null);
      } catch (error) {
        console.error("Fout bij het ophalen van leden:", error);
      }
    };

    loadData();
  }, []);

  const getClubName = (clubId) => {
    if (!clubs.length) return "Laden..."; // 🛠️ Voorkomt lege lijst
    if (!clubId) return "Geen club";
    const club = clubs.find((c) => c._id === clubId);
    return club ? club.naam : "Onbekende club";
  };

  const filteredUsers = users.filter((user) => {
    if (!trainer) return false;
    if (user.role !== "Vechter") return false;
    if (user.club !== trainer.club) return false;

    const fullName = `${user.voornaam} ${user.achternaam}`.toLowerCase();
    const roleName = user.role.toLowerCase();
    const clubName = getClubName(user.club).toLowerCase();

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      roleName.includes(searchTerm.toLowerCase()) ||
      clubName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="members-page">
      <h1 className="page-title">Ledenlijst</h1>

      {/* Zoekbalk */}
      <input
        type="text"
        placeholder="Zoek op naam, club of rol..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Ledenlijst Tabel */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Profielfoto</th>
              <th>Naam</th>
              <th>Club</th>
              <th>Rol</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.profielfoto}
                      alt={user.voornaam}
                      className="profile-img"
                    />
                  </td>
                  <td>
                    {user.voornaam} {user.achternaam}
                  </td>
                  <td>{getClubName(user.club)}</td>
                  <td>{user.role}</td>
                  <td>
                    <Link to={`/member/${user._id}`} className="view-button">
                      Bekijk
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  Geen leden gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Voeg Lid Toe Knop */}
      <Link to="/add-member" className="add-member-button">
        Voeg Lid Toe
      </Link>
    </div>
  );
};

export default MembersPage;
