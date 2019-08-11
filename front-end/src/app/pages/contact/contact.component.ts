import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/@core/services/share.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shop-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  lat: number = 10.848552;
  lng: number = 106.787487;
  public feedbackForm: FormGroup;
  constructor(private shareService: ShareService, private formBuilder: FormBuilder, private toast: ToastrService) { }

  ngOnInit() {
    this.buildForm();
  }

  feedback() {
    const feedback = {
      fullname: this.feedbackForm.value.fullName,
      email: this.feedbackForm.value.email,
      subject: this.feedbackForm.value.subject,
      content: this.feedbackForm.value.content,
    };
    this.shareService.sentEmail(feedback).subscribe(data => {
      if (data) {
        this.toast.success(data['message']);
        this.feedbackForm.reset();
      }
    });
  }

  private buildForm() {
    this.feedbackForm = this.formBuilder.group({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
    });
  }

}
