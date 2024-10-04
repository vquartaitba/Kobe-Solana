const express = require("express");
const { processInput } = require("./main");
const cors = require("cors");
const { deployToSolana } = require("../rustBranch/js/deployer");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const app = express();

app.use(cors());
app.use(express.json());

// Ruta para manejar el input del usuario
app.post("/api/process", async (req, res) => {
  try {
    // console.log("Solicitud recibida en el backend:", req.body);

    const { userTask } = req.body;
    const result = await processInput(userTask);

    // console.log("Respuesta generada:", result);

    if (result) {
      res.json(result);
    } else {
      console.error("Error: Respuesta vacía o nula.");
      res
        .status(500)
        .json({ error: "Error en la generación de la respuesta." });
    }
  } catch (error) {
    console.error("Error en el backend:", error);
    res.status(500).json({ error: error.message });
  }
});


// Ruta para manejar el despliegue a solana
app.post("/api/deploy/solana", async (req, res) => {
  try {
    const deployedAddress = await deployToSolana();
    if (deployedAddress) {
      res.json({ deployedAddress });
    } else {
      res.status(500).json({ error: "Failed to deploy contract on solana" });
    }
  } catch (error) {
    console.error("Error en el despliegue en solana:", error);
    res.status(500).json({ error: error.message });
  }
});

// Configuración del puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
