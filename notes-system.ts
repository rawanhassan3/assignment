
//  Simple Notes Management System

export {};


class Storage<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  getAllItems(): T[] {
    return [...this.items]; 
  }
}


class User {
  protected id: number; 
  public name: string;
  public email: string;
  private password: string; 
  public phone: string;
  private _age!: number;

  
  private notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age; 
  }

 
  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }

  getId(): number {
    return this.id;
  }

 
  addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }

  getNotebooks(): NoteBook[] {
    return [...this.notebooks];
  }

  displayInfo(): void {
    console.log(`ID: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Email: ${this.email}`);
    console.log(`Phone: ${this.phone}`);
    console.log(`Age: ${this.age}`);
  }
}


class Admin extends User {
  // Admin can manage notes: here he can delete any note in any notebook
  manageNotes(notebook: NoteBook, noteId: number): void {
    const removed = notebook.removeNote(noteId);
    console.log(
      removed
        ? `Admin ${this.name} deleted note #${noteId}`
        : `Admin ${this.name}: note #${noteId} not found`
    );
  }

  override displayInfo(): void {
    console.log("--- Admin ---");
    super.displayInfo();
  }
}


class Note {
  public id: number;
  public title: string;
  public content: string;
  public author: User;

  constructor(id: number, title: string, content: string, author: User) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
  }

  get userId(): number {
    return this.author.getId();
  }

  preview(length: number = 20): string {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}


class NoteBook {
  private notes: Note[] = [];
  private nextNoteId = 1;

  constructor(public title: string) {}

  addNote(title: string, content: string, author: User): Note {
    const note = new Note(this.nextNoteId++, title, content, author);
    this.notes.push(note);
    return note;
  }

  removeNote(noteId: number): boolean {
    const index = this.notes.findIndex((n) => n.id === noteId);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    return true;
  }

  getNotes(): Note[] {
    return [...this.notes];
  }
}


const user = new User(1, "Rawan", "rawan@mail.com", "1234", "01000000000", 22);
const admin = new Admin(2, "Ahmed", "ahmed@mail.com", "admin", "01111111111", 35);

user.displayInfo();
admin.displayInfo();

const workBook = new NoteBook("Work");
user.addNotebook(workBook);


const n1 = workBook.addNote("Todo", "Finish the TypeScript OOP assignment today", user);
workBook.addNote("Ideas", "Build a notes app", user);

console.log(n1.preview()); 
console.log(`Author id of note #1: ${n1.userId}`);

admin.manageNotes(workBook, 1);
console.log(`Notes left: ${workBook.getNotes().length}`);

const numbers = new Storage<number>();
numbers.addItem(10);
numbers.addItem(20);
numbers.removeItem(10);
console.log(numbers.getAllItems());

const users = new Storage<User>();
users.addItem(user);
users.addItem(admin);
console.log(users.getAllItems().length);


try {
  new User(3, "Kid", "kid@mail.com", "pass", "0123", 15);
} catch (e) {
  console.log((e as Error).message);
}