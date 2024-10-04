const fs = require('fs');
const axios = require('axios');
const { exec } = require("child_process");
const path = require('path');
const { generateRustPrompt, generateImprovementPrompt, generateForTesting, generateTestPrompt } = require('./longstrings');
const { generateMessageWithClaude } = require('./claudeApi');

const projectDir = __dirname;
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const id = process.env.PROGRAM_ID;
const testFilePath = path.join(projectDir, '../tests/kobe-solana.ts');

function runCommand(command) {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd: projectDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                console.error(`stdout: ${stdout}`);
                return resolve(stderr || stdout); // En lugar de rechazar, resolver con salida de error
            }
            resolve(stdout);
        });

        process.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        process.stderr.on("data", (data) => {
            console.error(data.toString());
        });
    });
}

const model = 'claude-3-5-sonnet-20240620';
async function generateRustSmartContract(userTask) {
  try {
    console.log("Resolving dependencies..."); 
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Dependecies solved!")
    rustPrompt = generateRustPrompt(userTask,id);
    let rustCode = await generateMessageWithClaude(rustPrompt, model);
    const rustFilePath = path.join(projectDir, '../programs/kobe-solana/src/lib.rs'); 
    fs.writeFileSync(rustFilePath, rustCode);
    console.log(`Code written to ${rustFilePath}`);
    chau = false
    todoOk = 0
    for (let i = 0; i < 5; i++) {
        try {
            if(todoOk==1){
              console.log("Contract is ok")
              break;

            }else{
              console.log("Building contract...");
              const buildingResults = await runCommand("anchor build");
              console.log(`Build results: ${buildingResults}`);

              console.log("Generating improvement prompt...");
              const improvementPrompt = generateImprovementPrompt(rustCode,buildingResults,id);
              
              console.log("Generating improved code...");
              rustCode = await generateMessageWithClaude(improvementPrompt, model);
              console.log("Resolving dependencies..."); 
              console.log(`Improved code: ${rustCode}`);
              fs.writeFileSync(rustFilePath, rustCode);
              console.log(`Code written to ${rustFilePath}`);

              todoOk = await generateMessageWithClaude(generateForTesting(buildingResults),model,1)
              
            }
            
        } catch (error) {
            console.error(`Error during iteration ${i}:`, error);
            break; // Salir del bucle si ocurre un error
        }
      }
      for (let i = 0; i < 5; i++) {
        console.log(`Iteration ${i + 1}`);
        
        // Generar el código de test
        const testPrompt = generateTestPrompt(rustCode);
        const testCode = await generateMessageWithClaude(testPrompt, model);
        fs.writeFileSync(testFilePath, testCode);
        console.log(`Test code written to ${testFilePath}`);

        
        console.log("Running tests...");
        const testResults = await runCommand("anchor test");
        console.log(`Test results: ${testResults}`);

        const testingResult = await generateMessageWithClaude(generateForTesting(testResults), model, 1);
        if (testingResult === 0) {
          console.log("Errors found. Generating improvements...");
          const improvementPrompt = generateImprovementPrompt(rustCode, testResults, id);
          rustCode = await generateMessageWithClaude(improvementPrompt, model);
          fs.writeFileSync(rustFilePath, rustCode);
          console.log(`Improved code written to ${rustFilePath}`);
        } else {
          console.log("All tests passed successfully.");
          break;
        }
      }

    return {rustCode, rustCode};
    
  } catch (error) {
    console.error("An error occurred during the process.", error);
    throw error;
  }
}

// (async () => {
//   try {
//     const inputTask = "make a smart contract that emulates a soccer game";
//     const  rustCode= await generateRustSmartContract(inputTask);
//     console.log("Final Anchor Rust Code:\n", rustCode);
 
//   } catch (error) {
//     console.error("Error in example usage:", error);
//   }
// })();

module.exports = { generateRustSmartContract};
