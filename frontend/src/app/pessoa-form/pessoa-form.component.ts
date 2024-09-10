import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { Pessoa } from '../pessoa.interface';

@Component({
  selector: 'app-pessoa-form',
  standalone: true,
  imports: [],
  templateUrl: './pessoa-form.component.html',
  styleUrl: './pessoa-form.component.css'
})
export class PessoaFormComponent {
  pessoaForm: FormGroup;
  pessoas: Pessoa[] = [];
  selectedPessoa: Pessoa | null = null;

  constructor(private formBuilder: FormBuilder, private pessoaService: PessoaService) {
    this.pessoaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      data_nasc: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      sexo: ['', Validators.required],
      altura: ['', [Validators.required, Validators.min(0)]],
      peso: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.pessoaForm.valid) {
      const pessoa: Pessoa = this.pessoaForm.value;
      this.pessoaService.create(pessoa).subscribe(
        response => {
          console.log('Pessoa criada com sucesso!', response);
          this.pessoaForm.reset();
        },
        error => console.error('Erro ao criar pessoa', error)
      );
    }
  }

}
