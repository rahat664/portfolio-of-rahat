import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {
  isSending = false;
  formData = { name: '', email: '', contact: '', message: '' };

  constructor(private toastr: ToastrService) {}

  async send(form: NgForm): Promise<void> {
    if (form.invalid || this.isSending) return;
    this.isSending = true;
    try {
      emailjs.init('bIOkHjsS8oTyc1suP');
      await emailjs.send('service_xlvu8jr', 'template_spkcqwl', {
        from_name: this.formData.name.trim(),
        to_name: 'Admin',
        contact: this.formData.contact,
        message: this.formData.message.trim(),
        from_email: this.formData.email.trim()
      });
      this.toastr.success('Your message has been sent.', 'Success');
      form.resetForm({ name: '', email: '', contact: '', message: '' });
    } catch {
      this.toastr.error('Message not sent. Please try again or email me directly.', 'Error');
    } finally {
      this.isSending = false;
    }
  }
}
