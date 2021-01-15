import validator from "validator";

class FormValidator {
  private form: HTMLFormElement;

  private ids?: Array<string> = [];

  private min?: number;

  private max?: number;

  constructor(
    form: HTMLFormElement,
    min?: number,
    max?: number,
    ...ids: string[]
  ) {
    this.form = form;

    if (min !== undefined) {
      this.min = min;
    }

    if (max !== undefined) {
      this.max = max;
    }

    ids.forEach((id) => this.ids?.push(id));
  }

  init(): void {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.removeMessage();
      console.log(
        this.verifyEmptyInputs("text"),
        this.verifyEmptyInputs("email"),
        this.verifyEmptyInputs("password"),
        this.verifyRadioInputs(),
        this.verifyCheckBoxInputs(),
        this.verifyEmailInputs(),
      );
      if (
        this.verifyEmptyInputs("text") &&
        this.verifyEmptyInputs("email") &&
        this.verifyEmptyInputs("password") &&
        this.verifyRadioInputs() &&
        this.verifyCheckBoxInputs() &&
        this.verifyEmailInputs()
      ) {
        alert("Formulario enviado");
      }
      if (
        this.min !== undefined &&
        this.max !== undefined &&
        this.ids !== undefined
      ) {
        this.contentSize(this.min, this.max);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  verifyEmptyInput(input: HTMLInputElement): boolean {
    if (!validator.isEmpty(input.value)) return false;
    return true;
  }

  verifyEmailInputs(): boolean {
    let valid = true;
    const inputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      `input[type='email']`,
    );

    inputs.forEach((input) => {
      if (!validator.isEmail(input.value)) {
        this.addMessage("This email is not valid", input);
        valid = false;
      }
    });

    return valid;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyRadioInputs(): boolean {
    const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input[type='radio']",
    );

    let radioValid = false;
    let i = 0;

    while (!radioValid && i < radios.length) {
      if (radios[i].checked) radioValid = true;
      if (!radioValid) this.addMessage("must check some option", radios[i]);
      i += 1;
    }

    return radioValid;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyCheckBoxInputs(): boolean {
    const checkboxs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input[type='checkbox']",
    );
    let checked = false;

    checkboxs.forEach((checkbox) => {
      checked = !!(checkbox.checked || checked === true);
      if (checked === false) {
        this.addMessage("must check some option", checkbox);
      }
    });

    return checked;
  }

  verifyEmptyInputs(type: string): boolean {
    let empty = false;
    const inputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      `input[type='${type}']`,
    );

    inputs.forEach((input) => {
      if (this.verifyEmptyInput(input)) {
        empty = true;
        if (input.previousElementSibling !== null) {
          this.addMessage(
            `${input.previousElementSibling.innerHTML.replace(
              ":",
              "",
            )} cannot be empty`,
            input,
          );
        }
      } else {
        empty = false;
      }
    });

    return empty;
  }

  // eslint-disable-next-line class-methods-use-this
  contentSize(min: number, max: number): void {
    this.ids?.forEach((id) => {
      const input = document.querySelector(`#${id}`) as HTMLInputElement;
      if (!(input.value.length >= min && input.value.length <= max)) {
        if (input.previousElementSibling !== null) {
          this.addMessage(
            `${input.previousElementSibling.innerHTML.replace(
              ":",
              "",
            )} must be between ${min} and ${max} characters`,
            input,
          );
        }
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private addMessage(msg: string, input: HTMLElement): void {
    const span: HTMLSpanElement = document.createElement("span");
    span.classList.add("error-message");
    span.innerText = msg;
    input.insertAdjacentElement("afterend", span);
  }

  // eslint-disable-next-line class-methods-use-this
  private removeMessage(): void {
    const errors: NodeListOf<HTMLSpanElement> = this.form.querySelectorAll(
      ".error-message",
    );

    errors.forEach((error) => error.remove());
  }
}

const form = document.querySelector("form") as HTMLFormElement;
const formValidator = new FormValidator(form, 5, 10, "name");
formValidator.init();
