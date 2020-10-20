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
// Initialize the employees array to an empty array
const employees = [];
// Questions for an Intern
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

// Questions for Engineer Employees
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

// Questions for Manager
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

// This code segment generates the employee profile
const collectInputs = async (inputs = []) => {
  try {
    const { again, ...answers } = await inquirer.prompt(inputs);    
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

      return collectInputs(inputs);
    } else {
      const html = await render(employees);
      fs.writeFileSync(outputPath, html);
    }
  } catch {
    throw new Error("Error Occured");
  }
};

// This code initiallizes the app by asking the client what kind of Employee he/she want to add.
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