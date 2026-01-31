import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "60px",
        marginTop: "120px",
      }}
    >
      {/* Garden Game */}
      <img
        src="/images/garden.png"
        alt="Garden Game"
        style={{
          width: "260px",
          cursor: "pointer",
          borderRadius: "16px",
        }}
        onClick={() => navigate("/garden")}
      />

      {/* Memory Game */}
      <img
        src="/images/memory.png"
        alt="Memory Game"
        style={{
          width: "260px",
          cursor: "pointer",
          borderRadius: "16px",
        }}
        onClick={() => navigate("/memory")}
      />
    </div>
  );
};

export default Menu;
