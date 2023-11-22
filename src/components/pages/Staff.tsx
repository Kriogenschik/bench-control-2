import StaffList from "../StaffList/StaffList";

const Staff = () => {
  return (
    <div className="tab__body">
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
        Staff
      </p>
      <StaffList/>
    </div>
  );
};

export default Staff;
