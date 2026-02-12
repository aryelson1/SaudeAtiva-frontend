import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
  alpha,
  LinearProgress,
  IconButton,
  Fade,
  InputAdornment,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  Collapse,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Badge as BadgeIcon,
  Wc,
  Send,
  ArrowBack,
  CheckCircle,
  KeyboardArrowUp,
  EditNote,
  Numbers,
  CheckBoxOutlined,
  RadioButtonChecked,
  LinearScale as LinearScaleIcon,
  ShortText,
  Subject,
  Security,
  VerifiedUser,
  Close,
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
} from '@mui/icons-material';
import { QuestionnaireAPI } from '@/apis/questionnaire.api';
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

interface AlertState {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

export default function QuestionnairePage() {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ open: false, message: '', severity: 'info' });
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

  const showAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (professionalId) {
      fetchQuestionnaires();
    }
  }, [professionalId]);

  const fetchQuestionnaires = async () => {
    try {
      const data = await QuestionnaireAPI.getQuestionnaire(professionalId as Uuid);

      if (data && data.success) {
        setProfessional(data.data.professional);
        setQuestionnaires(data.data.questionnaires);

        const initialAnswers: Record<string, Record<number, any>> = {};
        data.data.questionnaires.forEach((q: Questionnaire) => {
          initialAnswers[q.id] = {};
        });
        setAnswers(initialAnswers);
      } else {
        showAlert('Erro ao carregar formulários', 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showAlert('Erro ao carregar formulários', 'error');
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateProgress = () => {
    let totalFields = 3;
    let filledFields = 0;

    if (formData.clientName) filledFields++;
    if (formData.clientEmail) filledFields++;
    if (formData.clientPhone) filledFields++;

    if (consentAccepted) {
      totalFields++;
      filledFields++;
    } else {
      totalFields++;
    }

    questionnaires.forEach((q) => {
      q.perguntas.forEach((p) => {
        if (p.obrigatoria) {
          totalFields++;
          const answer = answers[q.id]?.[p.id];
          if (answer !== undefined && answer !== null && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
            filledFields++;
          }
        }
      });
    });

    return totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
  };

  const validateForm = () => {
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      showAlert('Preencha todos os campos obrigatórios de dados pessoais', 'warning');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.clientEmail)) {
      showAlert('Email inválido', 'warning');
      return false;
    }

    if (!consentAccepted) {
      showAlert('Aceite o termo de consentimento para continuar', 'warning');
      return false;
    }

    for (const questionnaire of questionnaires) {
      const currentAnswers = answers[questionnaire.id] || {};

      for (const question of questionnaire.perguntas) {
        if (question.obrigatoria) {
          const answer = currentAnswers[question.id];
          if (answer === undefined || answer === null || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
            showAlert(`Por favor, responda: ${question.pergunta}`, 'warning');
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientCpf: formData.clientCpf || undefined,
        clientBirthDate: formData.clientBirthDate || undefined,
        clientGender: formData.clientGender || undefined,
        responses: questionnaires.map((q) => ({
          questionnaireId: q.id,
          answers: answers[q.id] || {},
        })),
      };

      const data = await QuestionnaireAPI.submitQuestionnaire(professionalId as Uuid, payload);

      if (data && data.success) {
        showAlert('Formulário enviado com sucesso!', 'success');
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (data && data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((e: any) => e.msg || e.message).join(', ');
          showAlert(errorMessages, 'error');
        } else {
          showAlert(data?.message || 'Erro ao enviar formulário', 'error');
        }
      }
    } catch (error: any) {
      console.error('Erro:', error);
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((e: any) => e.msg || e.message).join(', ');
        showAlert(errorMessages, 'error');
      } else if (error.response?.data?.message) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert('Erro ao enviar formulário. Tente novamente.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getQuestionIcon = (tipo: string) => {
    const iconColor = theme.palette.text.secondary;
    switch (tipo) {
      case 'texto':
        return <ShortText sx={{ fontSize: 20, color: iconColor }} />;
      case 'texto_longo':
        return <Subject sx={{ fontSize: 20, color: iconColor }} />;
      case 'numero':
        return <Numbers sx={{ fontSize: 20, color: iconColor }} />;
      case 'data':
        return <CalendarToday sx={{ fontSize: 20, color: iconColor }} />;
      case 'sim_nao':
      case 'multipla_escolha':
        return <RadioButtonChecked sx={{ fontSize: 20, color: iconColor }} />;
      case 'checkbox':
        return <CheckBoxOutlined sx={{ fontSize: 20, color: iconColor }} />;
      case 'escala':
        return <LinearScaleIcon sx={{ fontSize: 20, color: iconColor }} />;
      default:
        return <EditNote sx={{ fontSize: 20, color: iconColor }} />;
    }
  };

  const renderQuestion = (question: Question, questionnaireId: string) => {
    const value = answers[questionnaireId]?.[question.id];

    const baseInputStyles = {
      '& .MuiOutlinedInput-root': {
        bgcolor: theme.palette.background.default,
        '& fieldset': {
          borderColor: alpha(theme.palette.text.secondary, 0.2),
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
      '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },
      },
    };

    switch (question.tipo) {
      case 'texto':
        return (
          <TextField
            fullWidth
            placeholder="Digite sua resposta"
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ShortText sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={baseInputStyles}
          />
        );

      case 'texto_longo':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Digite sua resposta detalhada"
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                  <Subject sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={baseInputStyles}
          />
        );

      case 'numero':
        return (
          <TextField
            type="number"
            placeholder="Digite um número"
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            size="medium"
            inputProps={{
              min: question.min,
              max: question.max,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Numbers sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{ ...baseInputStyles, maxWidth: 200 }}
          />
        );

      case 'data':
        return (
          <TextField
            type="date"
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
            variant="outlined"
            size="medium"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{ ...baseInputStyles, maxWidth: 250 }}
          />
        );

      case 'sim_nao':
        return (
          <RadioGroup
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
          >
            <Stack spacing={1.5}>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  border: '2px solid',
                  borderColor: value === 'Sim' ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.2),
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: value === 'Sim' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
                onClick={() => handleAnswerChange(questionnaireId, question.id, 'Sim')}
              >
                <FormControlLabel
                  value="Sim"
                  control={<Radio sx={{ color: theme.palette.primary.main }} />}
                  label={<Typography sx={{ fontSize: '0.95rem', fontWeight: value === 'Sim' ? 600 : 400 }}>Sim</Typography>}
                  sx={{ m: 0, width: '100%' }}
                />
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  border: '2px solid',
                  borderColor: value === 'Não' ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.2),
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: value === 'Não' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
                onClick={() => handleAnswerChange(questionnaireId, question.id, 'Não')}
              >
                <FormControlLabel
                  value="Não"
                  control={<Radio sx={{ color: theme.palette.primary.main }} />}
                  label={<Typography sx={{ fontSize: '0.95rem', fontWeight: value === 'Não' ? 600 : 400 }}>Não</Typography>}
                  sx={{ m: 0, width: '100%' }}
                />
              </Box>
            </Stack>
          </RadioGroup>
        );

      case 'multipla_escolha':
        return (
          <RadioGroup
            value={value || ''}
            onChange={(e) => handleAnswerChange(questionnaireId, question.id, e.target.value)}
          >
            <Stack spacing={1.5}>
              {question.opcoes?.map((opcao, idx) => (
                <Box
                  key={idx}
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: value === opcao ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: value === opcao ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.2),
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => handleAnswerChange(questionnaireId, question.id, opcao)}
                >
                  <FormControlLabel
                    value={opcao}
                    control={<Radio sx={{ color: theme.palette.primary.main }} />}
                    label={<Typography sx={{ fontSize: '0.95rem', fontWeight: value === opcao ? 600 : 400 }}>{opcao}</Typography>}
                    sx={{ m: 0, width: '100%' }}
                  />
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <FormGroup>
            <Stack spacing={1.5}>
              {question.opcoes?.map((opcao, idx) => (
                <Box
                  key={idx}
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: (value || []).includes(opcao) ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: (value || []).includes(opcao) ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.2),
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => {
                    const currentValues = value || [];
                    const newValues = currentValues.includes(opcao)
                      ? currentValues.filter((v: string) => v !== opcao)
                      : [...currentValues, opcao];
                    handleAnswerChange(questionnaireId, question.id, newValues);
                  }}
                >
                  <FormControlLabel
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
                        sx={{ color: theme.palette.primary.main }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.95rem', fontWeight: (value || []).includes(opcao) ? 600 : 400 }}>{opcao}</Typography>}
                    sx={{ m: 0, width: '100%' }}
                  />
                </Box>
              ))}
            </Stack>
          </FormGroup>
        );

      case 'escala':
        return (
          <Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 2 }}>
              {Array.from(
                { length: (question.max || 10) - (question.min || 1) + 1 },
                (_, i) => i + (question.min || 1)
              ).map((num) => (
                <Box
                  key={num}
                  onClick={() => handleAnswerChange(questionnaireId, question.id, num)}
                  sx={{
                    width: 52,
                    height: 52,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: value === num ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.2),
                    bgcolor: value === num ? theme.palette.primary.main : 'transparent',
                    color: value === num ? '#FFF' : theme.palette.text.primary,
                    cursor: 'pointer',
                    fontWeight: value === num ? 700 : 400,
                    fontSize: '1.1rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: value === num ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.08),
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {num}
                </Box>
              ))}
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: alpha(theme.palette.text.secondary, 0.3) }} />
                {question.min || 1} - Mínimo
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {question.max || 10} - Máximo
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
              </Typography>
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
          <Typography variant="body2" color="text.secondary">
            Carregando...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!professional || questionnaires.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: theme.palette.background.default,
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <InfoOutlined sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Nenhum formulário disponível
            </Typography>
            <Typography color="text.secondary" paragraph>
              O profissional ainda não configurou formulários.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              startIcon={<ArrowBack />}
            >
              Voltar
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: theme.palette.background.default,
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center', bgcolor: theme.palette.background.paper, p: 6, borderRadius: 4, boxShadow: theme.shadows[4] }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                }}
              >
                <CheckCircle sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Enviado com sucesso!
              </Typography>
              <Typography color="text.secondary" paragraph sx={{ mb: 4 }}>
                {professional.nome} receberá suas respostas e entrará em contato em breve.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                startIcon={<ArrowBack />}
                size="large"
              >
                Voltar ao início
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>
    );
  }

  const progress = calculateProgress();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        position: 'relative',
      }}
    >
      {/* Alert Global */}
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1200,
          width: '90%',
          maxWidth: 600,
        }}
      >
        <Collapse in={alert.open}>
          <Alert
            severity={alert.severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={closeAlert}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{
              boxShadow: theme.shadows[4],
              borderRadius: 2,
            }}
            icon={
              alert.severity === 'error' ? <ErrorOutline /> :
              alert.severity === 'warning' ? <WarningAmber /> :
              alert.severity === 'info' ? <InfoOutlined /> :
              <CheckCircle />
            }
          >
            <AlertTitle sx={{ fontWeight: 600 }}>
              {alert.severity === 'error' ? 'Erro' :
               alert.severity === 'warning' ? 'Atenção' :
               alert.severity === 'info' ? 'Informação' :
               'Sucesso'}
            </AlertTitle>
            {alert.message}
          </Alert>
        </Collapse>
      </Box>

      {/* Progress Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: theme.palette.primary.main,
            },
          }}
        />
      </Box>

      <Container maxWidth="md" sx={{ pt: 8, pb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Avatar
            src={professional.foto}
            sx={{
              width: 88,
              height: 88,
              margin: '0 auto',
              mb: 2,
              border: `3px solid ${theme.palette.primary.main}`,
              boxShadow: theme.shadows[3],
            }}
          >
            {professional.nome[0]}
          </Avatar>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {professional.nome}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
            <VerifiedUser sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography variant="body2" color="text.secondary">
              {professional.especialidade}
            </Typography>
          </Stack>
          <Chip
            label={professional.tipo === 'NUTRICIONISTA' ? 'Nutricionista' : 'Psicólogo(a)'}
            size="small"
            color="primary"
          />
        </Box>

        {/* Dados Pessoais */}
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <Person sx={{ fontSize: 24, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={600}>
              Dados Pessoais
            </Typography>
          </Stack>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nome completo"
              placeholder="Seu nome"
              value={formData.clientName}
              onChange={(e) => handleFormDataChange('clientName', e.target.value)}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.background.default,
                  '& fieldset': {
                    borderColor: alpha(theme.palette.text.secondary, 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
              }}
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={formData.clientEmail}
                onChange={(e) => handleFormDataChange('clientEmail', e.target.value)}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.background.default,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.text.secondary, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Telefone"
                placeholder="(00) 00000-0000"
                value={formData.clientPhone}
                onChange={(e) => handleFormDataChange('clientPhone', e.target.value)}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.background.default,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.text.secondary, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="CPF (opcional)"
                placeholder="000.000.000-00"
                value={formData.clientCpf}
                onChange={(e) => handleFormDataChange('clientCpf', e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.background.default,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.text.secondary, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Data de nascimento (opcional)"
                type="date"
                value={formData.clientBirthDate}
                onChange={(e) => handleFormDataChange('clientBirthDate', e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.background.default,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.text.secondary, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Gênero (opcional)</InputLabel>
                <Select
                  value={formData.clientGender}
                  onChange={(e) => handleFormDataChange('clientGender', e.target.value as string)}
                  label="Gênero (opcional)"
                  startAdornment={
                    <InputAdornment position="start">
                      <Wc sx={{ color: theme.palette.text.secondary, ml: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    bgcolor: theme.palette.background.default,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.text.secondary, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="MASCULINO">Masculino</MenuItem>
                  <MenuItem value="FEMININO">Feminino</MenuItem>
                  <MenuItem value="OUTRO">Outro</MenuItem>
                  <MenuItem value="NAO_INFORMAR">Prefiro não informar</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>

        {/* Termo de Consentimento */}
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Security sx={{ fontSize: 24, color: theme.palette.secondary.main }} />
            <Typography variant="h6" fontWeight={600}>
              Termo de Consentimento
            </Typography>
          </Stack>
          <Box
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.secondary.main, 0.05),
              borderRadius: 2,
              mb: 2,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            }}
          >
            <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.8, mb: 0 }}>
              Declaro que as informações fornecidas são verdadeiras. Autorizo {professional.nome} a utilizar
              esses dados para atendimento profissional, conforme a LGPD.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                sx={{ color: theme.palette.secondary.main }}
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                Li e aceito os termos <Typography component="span" color="error">*</Typography>
              </Typography>
            }
          />
        </Box>

        {/* Questionários */}
        {questionnaires.map((questionnaire) => (
          <Box key={questionnaire.id} sx={{ mb: 6 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <EditNote sx={{ fontSize: 24, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}>
                {questionnaire.titulo}
              </Typography>
              {questionnaire.obrigatorio && (
                <Chip
                  label="Obrigatório"
                  size="small"
                  color="error"
                />
              )}
            </Stack>

            {questionnaire.descricao && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {questionnaire.descricao}
              </Typography>
            )}

            <Stack spacing={4}>
              {questionnaire.perguntas.map((question, index) => (
                <Box key={question.id}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    {getQuestionIcon(question.tipo)}
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      {index + 1}.
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {question.pergunta}
                      {question.obrigatoria && (
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                          *
                        </Typography>
                      )}
                    </Typography>
                  </Stack>
                  <Box sx={{ pl: { xs: 0, md: 5 } }}>
                    {renderQuestion(question, questionnaire.id)}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}

        {/* Botão de Envio */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={submitting}
            endIcon={submitting ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : <Send />}
            sx={{
              px: 6,
              py: 2,
            }}
          >
            {submitting ? 'Enviando...' : 'Enviar Formulário'}
          </Button>
        </Box>
      </Container>

      {/* Scroll to Top */}
      {showScrollTop && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: theme.palette.primary.main,
            color: '#FFF',
            width: 52,
            height: 52,
            boxShadow: theme.shadows[4],
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[6],
            },
            transition: 'all 0.2s',
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      )}
    </Box>
  );
}