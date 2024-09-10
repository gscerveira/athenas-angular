import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { Pessoa } from '../pessoa.interface';

@Component({
  selector: 'app-pessoa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pessoa-form.component.html',
  styleUrl: './pessoa-form.component.css'
})
export class PessoaFormComponent implements OnInit {
  pessoaForm: FormGroup;
  pessoas: Pessoa[] = [];
  selectedPessoa: Pessoa | null = null;

  constructor(private formBuilder: FormBuilder, private pessoaService: PessoaService) {
    this.pessoaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      data_nasc: ['', [Validators.required, this.dateValidator]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      sexo: ['', Validators.required],
      altura: ['', [Validators.required, Validators.min(0)]],
      peso: ['', [Validators.required, Validators.min(0)]]
    });

    this.pessoaForm.setValue({
      nome: '',
      data_nasc: '',
      cpf: '',
      sexo: '',
      altura: '',
      peso: ''
    });
  }

  ngOnInit() {
      this.pessoaForm.valueChanges.subscribe(() => {
        console.log('Formulário válido:', this.pessoaForm.valid);
        console.log('Valores do formulário:', this.pessoaForm.value);
        console.log('Erros no formulário:', this.pessoaForm.errors);
      });
  }

  dateValidator(control: AbstractControl): {[key: string]: any} | null {
    if (!control.value) {
      return null;
    }
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(control.value);
    return valid ? null : { invalidDate: { value: control.value } };
  } 

  onSubmit() {
    if (this.pessoaForm.valid) {
      const pessoaData = { ...this.pessoaForm.value };
      pessoaData.data_nasc = this.ensureDateFormat(pessoaData.data_nasc);
      this.pessoaService.create(pessoaData).subscribe(
        response => {
          console.log('Pessoa criada com sucesso!', response);
          this.pessoaForm.reset();
        },
        error => console.error('Erro ao criar pessoa', error)
      );
    }
  }

  ensureDateFormat(dateString: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    const [day, month, year] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  onSearch() {
    const nome = this.pessoaForm.get('nome')?.value;
    if (nome) {
      this.pessoaService.search(nome).subscribe(
        pessoas => {
          this.pessoas = pessoas;
          this.selectedPessoa = null;
        },
        error => console.error('Erro ao pesquisar pessoas', error)
      );
    }
  }

  onSelect(pessoa: Pessoa) {
    this.selectedPessoa = pessoa;
    this.pessoaForm.patchValue({
      ...pessoa,
      data_nasc: this.formatDateForInput(pessoa.data_nasc)
    });
  }

  formatDateForInput(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  onUpdate() {
    if (this.selectedPessoa && this.pessoaForm.valid) {
      const updatedPessoa: Pessoa = { ...this.selectedPessoa, ...this.pessoaForm.value };
      this.pessoaService.update(this.selectedPessoa.id!, updatedPessoa).subscribe(
        response => {
          console.log('Pessoa atualizada com sucesso!', response);
          this.onSearch();
        },
        error => console.error('Erro ao atualizar pessoa', error)
      );
    }
  }

  onDelete() {
    if (this.selectedPessoa) {
      this.pessoaService.delete(this.selectedPessoa.id!).subscribe(
        () => {
          console.log('Pessoa deletada com sucesso!');
          this.onSearch();
          this.selectedPessoa = null;
          this.pessoaForm.reset();
        },
        error => console.error('Erro ao deletar pessoa', error)
      );
    }
  }

  onCalculateIdealWeight() {
    if (this.selectedPessoa) {
      this.pessoaService.calculateIdealWeight(this.selectedPessoa.id!).subscribe(
        response => {
          alert(`Peso ideal: ${response.peso_ideal.toFixed(2)} kg`);
        },
        error => console.error('Erro ao calcular peso ideal', error)
      );
    }
  }
}
