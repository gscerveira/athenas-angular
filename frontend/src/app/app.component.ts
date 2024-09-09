import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PessoaFormComponent } from "./pessoa-form/pessoa-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PessoaFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
