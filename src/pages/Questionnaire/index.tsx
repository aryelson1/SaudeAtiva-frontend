import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  LinearProgress,
  Alert,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Assignment,
  CheckCircle,
  Send,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Questionnaire } from '@/apis/questionnaire.api';
import type { Uuid } from '@/utils/Uuid';

interface Question {
  id: number;
  pergunta: string;
  tipo: 'texto' | 'texto_longo' | 'multipla_escolha' | 'sim_nao' | 'numero' | 'data' | 'checkbox' | 'escala';
  opcoes?: string[];
  obrigatoria?: boolean;
  min?: number;
  max?: number;
}

interface Questionnaire {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  perguntas: Question[];
  obrigatorio: boolean;
}

interface Professional {
  id: string;
  nome: string;
  tipo: string;
  especialidade?: string;
  foto?: string;
  bio?: string;
}

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCpf?: string;
  clientBirthDate?: string;
  clientGender?: string;
}

export default function QuestionnairePage() {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCpf: '',
    clientBirthDate: '',
    clientGender: '',
  });
  const [answers, setAnswers] = useState<Record<string, Record<number, any>>>({});

  useEffect(() => {
    if (professionalId) {
      fetchQuestionnaires();
    }
  }, [professionalId]);

  const fetchQuestionnaires = async () => {
    try {
      const data = await Questionnaire.getQuestionnaire(professionalId as Uuid);

      if (data.success) {
        setProfessional(data.data.professional);
        setQuestionnaires(data.data.questionnaires);

        // Inicializar respostas vazias
        const initialAnswers: Record<string, Record<number, any>> = {};
        data.data.questionnaires.forEach((q: Questionnaire) => {
          initialAnswers[q.id] = {};
        });
        setAnswers(initialAnswers);
      } else {
        enqueueSnackbar('Erro ao carregar formulários', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro:', error);
      enqueueSnackbar('Erro ao carregar formulários', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormDataChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (questionnaireId: string, questionId: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionnaireId]: {
        ...prev[questionnaireId],
        [questionId]: value,
      },
    }));
  };

  const validateStep = () => {
    if (currentStep === 0) {
      // Validar dados pessoais
      if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
        enqueueSnackbar('Preencha todos os campos obrigatórios', { variant: 'warning' });
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        enqueueSnackbar('Email inválido', { variant: 'warning' });
        return false;
      }

      return true;
    } else {
      // Validar perguntas obrigatórias
      const currentQuestionnaire = questionnaires[currentStep - 1];
      const currentAnswers = answers[currentQuestionnaire.id] || {};

      for (const question of currentQuestionnaire.perguntas) {
        if (question.obrigatoria) {
          const answer = currentAnswers[question.id];
          if (answer === undefined || answer === null || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
            enqueueSnackbar(`Por favor, responda: ${question.pergunta}`, { variant: 'warning' });
            return false;
          }
        }
      }

      return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSubmitting(true);

    try {
      const responses = questionnaires.map((q) => ({
        questionnaireId: q.id,
        answers: answers[q.id],
      }));

      const response = await fetch(`/api/questionnaire/${professionalId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          responses,
        }),
      });

      const data = await response.json();

      if (data.success) {
        enqueueSnackbar('✅ Formulário enviado com sucesso!', { variant: 'success' });
        setCurrentStep(questionnaires.length + 1); // Página de sucesso
      } else {
        enqueueSnackbar(data.message || 'Erro ao enviar formulário', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro:', error);
      enqueueSnackbar('Erro ao enviar formulário', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question, questionnaireId: string) => {
    const value = answers[questionnaireId]?.[question.id];

    switch (question.tipo) {
      case 'texto':
        return (
          <TextField
            fullWidth
            label={question.pergunta}
            required={question.obrigatoria}
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            placeholder="Digite sua resposta"
          />
        );

      case 'texto_longo':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={question.pergunta}
            required={question.obrigatoria}
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            placeholder="Digite sua resposta detalhada"
          />
        );

      case 'numero':
        return (
          <TextField
            fullWidth
            type="number"
            label={question.pergunta}
            required={question.obrigatoria}
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            placeholder="Digite um número"
            inputProps={{
              min: question.min,
              max: question.max,
            }}
          />
        );

      case 'data':
        return (
          <TextField
            fullWidth
            type="date"
            label={question.pergunta}
            required={question.obrigatoria}
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'sim_nao':
        return (
          <FormControl component="fieldset" required={question.obrigatoria}>
            <FormLabel component="legend">{question.pergunta}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            >
              <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
              <FormControlLabel value="Não" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>
        );

      case 'multipla_escolha':
        return (
          <FormControl component="fieldset" required={question.obrigatoria}>
            <FormLabel component="legend">{question.pergunta}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            >
              {question.opcoes?.map((opcao, idx) => (
                <FormControlLabel key={idx} value={opcao} control={<Radio />} label={opcao} />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset" required={question.obrigatoria}>
            <FormLabel component="legend">{question.pergunta}</FormLabel>
            <FormGroup>
              {question.opcoes?.map((opcao, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      checked={(value || []).includes(opcao)}
                      onChange={(e) => {
                        const currentValues = value || [];
                        const newValues = e.target.checked
                          ? [...currentValues, opcao]
                          : currentValues.filter((v: string) => v !== opcao);
                        handleAnswerChange(questionnaireId, question.id, newValues);
                      }}
                    />
                  }
                  label={opcao}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      case 'escala':
        return (
          <FormControl fullWidth required={question.obrigatoria}>
            <InputLabel>{question.pergunta}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
              label={question.pergunta}
            >
              {Array.from({ length: (question.max || 10) - (question.min || 1) + 1 }, (_, i) => i + (question.min || 1)).map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Stack spacing={2} alignItems="center">
          <LinearProgress sx={{ width: 200 }} />
          <Typography color="text.secondary">Carregando formulário...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!professional || questionnaires.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            Nenhum formulário disponível
          </Typography>
          <Typography>O profissional ainda não configurou formulários para você responder.</Typography>
        </Alert>
      </Container>
    );
  }

  const totalSteps = questionnaires.length + 1; // +1 para dados pessoais
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Página de sucesso
  if (currentStep > questionnaires.length) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', py: 4 }}>
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Formulário Enviado!
            </Typography>
            <Typography color="text.secondary" paragraph>
              Obrigado por responder o formulário. {professional.nome} receberá suas respostas em breve.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Voltar ao Início
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: 4 }}>
      <Container maxWidth="md">
        {/* Header com informações do profissional */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Avatar src={professional.foto} sx={{ width: 64, height: 64 }}>
              {professional.nome[0]}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h6" fontWeight="bold">
                {professional.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {professional.especialidade} • {professional.tipo === 'NUTRICIONISTA' ? 'Nutricionista' : 'Psicólogo(a)'}
              </Typography>
            </Box>
            <Chip
              icon={<Assignment />}
              label={`${questionnaires.length} formulário(s)`}
              color="primary"
              variant="outlined"
            />
          </Stack>
          {professional.bio && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {professional.bio}
              </Typography>
            </>
          )}
        </Paper>

        {/* Progress Bar */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="bold">
              Progresso
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {currentStep + 1} de {totalSteps}
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
        </Paper>

        {/* Formulário */}
        <Card sx={{ borderRadius: 3, p: isMobile ? 2 : 4 }}>
          <CardContent>
            {currentStep === 0 ? (
              // Etapa 1: Dados Pessoais
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Seus Dados
                  </Typography>
                  <Typography color="text.secondary">
                    Precisamos de algumas informações básicas para iniciar.
                  </Typography>
                </Box>

                <Divider />

                <TextField
                  fullWidth
                  label="Nome Completo"
                  required
                  value={formData.clientName}
                  onChange={(e) => handleFormDataChange('clientName', e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) => handleFormDataChange('clientEmail', e.target.value)}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Telefone"
                  required
                  value={formData.clientPhone}
                  onChange={(e) => handleFormDataChange('clientPhone', e.target.value)}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  placeholder="(00) 00000-0000"
                />

                <TextField
                  fullWidth
                  label="CPF (opcional)"
                  value={formData.clientCpf}
                  onChange={(e) => handleFormDataChange('clientCpf', e.target.value)}
                  placeholder="000.000.000-00"
                />

                <TextField
                  fullWidth
                  type="date"
                  label="Data de Nascimento (opcional)"
                  value={formData.clientBirthDate}
                  onChange={(e) => handleFormDataChange('clientBirthDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl fullWidth>
                  <InputLabel>Gênero (opcional)</InputLabel>
                  <Select
                    value={formData.clientGender}
                    onChange={(e) => handleFormDataChange('clientGender', e.target.value as string)}
                    label="Gênero (opcional)"
                  >
                    <MenuItem value="MASCULINO">Masculino</MenuItem>
                    <MenuItem value="FEMININO">Feminino</MenuItem>
                    <MenuItem value="OUTRO">Outro</MenuItem>
                    <MenuItem value="NAO_INFORMAR">Prefiro não informar</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            ) : (
              // Etapas seguintes: Questionários
              <Stack spacing={3}>
                {(() => {
                  const questionnaire = questionnaires[currentStep - 1];
                  return (
                    <>
                      <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {questionnaire.titulo}
                        </Typography>
                        {questionnaire.descricao && (
                          <Typography color="text.secondary">{questionnaire.descricao}</Typography>
                        )}
                        {questionnaire.obrigatorio && (
                          <Chip label="Obrigatório" color="warning" size="small" sx={{ mt: 1 }} />
                        )}
                      </Box>

                      <Divider />

                      {questionnaire.perguntas.map((question) => (
                        <Box key={question.id}>
                          {renderQuestion(question, questionnaire.id)}
                        </Box>
                      ))}
                    </>
                  );
                })()}
              </Stack>
            )}
          </CardContent>

          {/* Botões de navegação */}
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3, px: isMobile ? 2 : 4, pb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>

            {currentStep === questionnaires.length ? (
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={handleSubmit}
                disabled={submitting}
                size="large"
              >
                {submitting ? 'Enviando...' : 'Enviar Formulário'}
              </Button>
            ) : (
              <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext} size="large">
                Próximo
              </Button>
            )}
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}