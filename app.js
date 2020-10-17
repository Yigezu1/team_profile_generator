const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const employees = [];
const internQ = [
  {
    type: "input",
    message: "What is the name of the intern?",
    name: "name",
  },
  {
    type: "input",
    message: "What is the id of the intern?",
    name: "id",
  },
  {
    type: "input",
    message: "What is the email address of the intern?",
    name: "email",
  },
  {
    type: "input",
    message: "What is the school of the intern?",
    name: "school",
  },
  {
    type: "confirm",
    name: "again",
    message: "Enter another input? ",
    default: true,
  },
];

const engineerQ = [
  {
    type: "input",
    message: "What is the name of the engineer?",
    name: "name",
  },
  {
    type: "input",
    message: "What is the id of the engineer?",
    name: "id",
  },
  {
    type: "input",
    message: "What is the email address the engineer?",
    name: "email",
  },
  {
    type: "input",
    message: "What is the GitHub user name of the engineer?",
    name: "githubuser",
  },
  {
    type: "confirm",
    name: "again",
    message: "Enter another input? ",
    default: true,
  },
];

const managerQ = [
  {
    type: "input",
    message: "What is the name of the manager?",
    name: "name",
  },
  {
    type: "input",
    message: "What is the id of the manager?",
    name: "id",
  },
  {
    type: "input",
    message: "What is the email address of the manager?",
    name: "email",
  },
  {
    type: "input",
    message: "What is the office number of the manager?",
    name: "officeNumber",
  },
  {
    type: "confirm",
    name: "again",
    message: "Enter another input? ",
    default: true,
  },
];

const collectInputs = async (inputs = []) => {
  try {
    const { again, ...answers } = await inquirer.prompt(inputs);
    // const newInputs = [...inputs, answers];
    const { name, id, email, githubuser, school, officeNumber } = answers;
    if (officeNumber) {
      employees.push(new Manager(name, id, email, officeNumber));
    } else if (githubuser) {
      employees.push(new Engineer(name, id, email, githubuser));
    } else {
      employees.push(new Intern(name, id, email, school));
    }
    console.log(employees);
    if (again) {
      const { inpType } = await inquirer.prompt([
        {
          type: "list",
          message: "What type of employee you want to add?",
          name: "inpType",
          choices: ["Manager", "Engineer", "Intern"],
        },
      ]);
      switch (inpType) {
        case "Manager":
          inputs = managerQ;
          break;
        case "Engineer":
          inputs = engineerQ;
          break;
        case "Intern":
          inputs = internQ;
          break;
        default:
      }
      // inpType === "Engineer" ? (inputs = engineerQ) : (inputs = internQ);

      return collectInputs(inputs);
    } else {
      const html = await render(employees);
      fs.writeFileSync(outputPath, html);
    }
  } catch {
    throw new Error("Error Occured");
  }
};

inquirer
  .prompt([
    {
      type: "list",
      message: "What type of employee you want to add?",
      name: "inpType",
      choices: ["Manager", "Engineer", "Intern"],
    },
  ])
  .then(function (response) {
    let data = "";
    const { inpType } = response;
    switch (inpType) {
      case "Manager":
        data = managerQ;
        break;
      case "Engineer":
        data = engineerQ;
        break;
      case "Intern":
        data = internQ;
        break;
      default:
    }
    collectInputs(data);
  });

async function renderToteam(html) {
  try {
    await fs.writeFile(outputPath, html);
  } catch {
    throw new Error("Error writing to file");
  }
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
