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
    this.pessoaForm.patchValue(pessoa);
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
