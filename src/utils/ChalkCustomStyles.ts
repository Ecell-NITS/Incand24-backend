import chalk from "chalk";

export const CError = (message: string | object) => {
  console.log(
    chalk.red.bold(
      typeof message === "string" ? message : JSON.stringify(message)
    )
  );
};

export const CSuccess = (message: string | object) => {
  console.log(
    chalk.green.bold(
      typeof message === "string" ? message : JSON.stringify(message)
    )
  );
};

export const CWarning = (message: string | object) => {
  console.log(
    chalk.yellow.bold(
      typeof message === "string" ? message : JSON.stringify(message)
    )
  );
};

export const CInfo = (message: string | object) => {
  console.log(
    chalk.green.bold(
      typeof message === "string" ? message : JSON.stringify(message)
    )
  );
};
