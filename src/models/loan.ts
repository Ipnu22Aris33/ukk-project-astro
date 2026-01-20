export interface Loan {
  id_loan: string;
  member_id: string;
  admin_id: string;
  book_id: string;
  loan_date: Date;
  due_date: Date;
  return_date: Date;
  status: string;
}
