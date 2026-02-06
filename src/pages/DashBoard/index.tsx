import { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Grid,
	Card,
	CardContent,
	Typography,
	Avatar,
	IconButton,
	Button,
	Chip,
	Stack,
	Paper,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	useTheme,
	useMediaQuery,
	Menu,
	MenuItem,
	ListItemIcon,
	Divider,
	Tooltip,
	Badge,
	Drawer,
} from '@mui/material';
import {
	Dashboard as DashboardIcon,
	People,
	CalendarMonth,
	AccessTime,
	VideoCall,
	LocationOn,
	Notifications,
	Settings,
	Logout,
	MoreVert,
	CheckCircle,
	Schedule,
	Menu as MenuIcon,
	Close,
	ContentCopy,
	Assignment,
} from '@mui/icons-material';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { enqueueSnackbar } from 'notistack';
import { getToken, logout } from '@/auth';
import { useNavigate } from 'react-router-dom';
import { ProfissionalApi } from '@/apis/professional.api';
import type { Uuid } from '@/utils/Uuid';
import { jwtDecode } from 'jwt-decode';

interface DashboardData {
	stats: {
		totalClients: number;
		totalAppointments: number;
		completedAppointments: number;
		pendingAppointments: number;
		todayAppointments: number;
		pendingQuestionnaires: number;
	};
	todayAppointments: Array<{
		id: string;
		date: string;
		isOnline: boolean;
		status: string;
		client: {
			name: string;
			photo?: string;
		};
	}>;
	upcomingAppointments: Array<{
		id: string;
		date: string;
		isOnline: boolean;
		status: string;
		client: {
			name: string;
			photo?: string;
		};
	}>;
	recentClients: Array<{
		name: string;
		email: string;
		phone?: string;
		photo?: string;
		createdAt: string;
	}>;
	pendingQuestionnaires: any[];
}

const COLORS = ['#FFB74D', '#66BB6A', '#4FC3F7', '#F06292', '#667eea'];

export default function ProfessionalDashboard() {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [user, setUser] = useState<{
		id: Uuid;
		username: string;
		type: string;
		specialty?: string;
		photo?: string;
	}>({
		id: '' as Uuid,
		username: '',
		type: '',
		specialty: undefined,
		photo: undefined,
	});

	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		if (!getToken()) {
			navigate('/login');
		}
	}, []);

	const fetchDashboardData = async () => {
		try {
			const response = await ProfissionalApi.dashboard();
			setDashboardData(response.data);
		} catch (error) {
			console.error('Erro ao carregar dashboard:', error);
			enqueueSnackbar('Erro ao carregar dados do dashboard', {
				variant: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
		const user = jwtDecode(localStorage.getItem('token') || '') as { username: string , id: Uuid, type: string, specialty?: string, photo?: string };
		setUser(user);
	}, []);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNotif(event.currentTarget);
	};

	const handleCloseNotif = () => {
		setAnchorElNotif(null);
	};

	const handleMobileMenuToggle = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const handleLogout = () => {
		handleCloseUserMenu();
		logout();
	};

	const getStatusColor = (status: string) => {
		const colors: Record<string, any> = {
			'Agendado': 'warning',
			'Confirmado': 'info',
			'Realizado': 'success',
			'Cancelado': 'error',
			'Não Compareceu': 'default',
		};
		return colors[status] || 'default';
	};

	const formatTime = (date: string) => {
		try {
			return format(new Date(date), 'HH:mm', { locale: ptBR });
		} catch {
			return '--:--';
		}
	};

	const formatDate = (date: string) => {
		try {
			return format(new Date(date), 'dd/MM HH:mm', { locale: ptBR });
		} catch {
			return '--/-- --:--';
		}
	};

	const copyQuestionnaireLink = () => {
		const link = `${window.location.origin}/questionnaire/${user?.id}`;
		navigator.clipboard.writeText(link);
		enqueueSnackbar('🎉 Link copiado com sucesso!', {
			variant: 'success',
		});
	};

	if (loading || !dashboardData) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
				<Stack spacing={2} alignItems="center">
					<LinearProgress sx={{ width: 200 }} />
					<Typography color="text.secondary">Carregando dashboard...</Typography>
				</Stack>
			</Box>
		);
	}

	const statusData = [
		{ name: 'Pendentes', value: dashboardData.stats.pendingAppointments },
		{ name: 'Concluídos', value: dashboardData.stats.completedAppointments },
	];

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
			{/* TOP NAVBAR */}
			<Paper
				elevation={0}
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 1100,
					bgcolor: 'white',
					borderBottom: '1px solid',
					borderColor: 'divider',
				}}
			>
				<Container maxWidth="xl">
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
						sx={{ height: 70 }}
					>
						{/* Logo/Brand */}
						<Stack direction="row" spacing={2} alignItems="center">
							{/* Menu Mobile */}
							{isMobile && (
								<IconButton
									edge="start"
									onClick={handleMobileMenuToggle}
									sx={{ mr: 1 }}
								>
									<MenuIcon />
								</IconButton>
							)}

							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: 2,
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
									fontWeight: 'bold',
									fontSize: '1.2rem',
								}}
							>
								💚
							</Box>
							<Typography variant="h6" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
								Saúde Ativa
							</Typography>
						</Stack>

						{/* Navigation - Desktop */}
						{!isMobile && (
							<Stack direction="row" spacing={1}>
								<Button
									startIcon={<DashboardIcon />}
									sx={{
										textTransform: 'none',
										color: 'primary.main',
										bgcolor: 'primary.lighter',
										fontWeight: 600,
										px: 2,
										'&:hover': {
											bgcolor: 'primary.light',
										},
									}}
								>
									Dashboard
								</Button>
								<Button
									startIcon={<People />}
									onClick={() => ''}
									sx={{
										textTransform: 'none',
										color: 'text.secondary',
										fontWeight: 600,
										px: 2,
										'&:hover': {
											bgcolor: 'action.hover',
										},
									}}
								>
									Pacientes
								</Button>
								<Button
									startIcon={<CalendarMonth />}
									onClick={() => ''}
									sx={{
										textTransform: 'none',
										color: 'text.secondary',
										fontWeight: 600,
										px: 2,
										'&:hover': {
											bgcolor: 'action.hover',
										},
									}}
								>
									Agendamentos
								</Button>
								<Button
									startIcon={<Assignment />}
									onClick={() => ''}
									sx={{
										textTransform: 'none',
										color: 'text.secondary',
										fontWeight: 600,
										px: 2,
										'&:hover': {
											bgcolor: 'action.hover',
										},
									}}
								>
									Questionários
								</Button>
								<Button
									variant="contained"
									startIcon={<ContentCopy />}
									onClick={copyQuestionnaireLink}
									sx={{
										textTransform: 'none',
										fontWeight: 600,
										px: 3,
										borderRadius: 2,
										boxShadow: '0 4px 12px rgba(102,126,234,0.4)',
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										'&:hover': {
											boxShadow: '0 6px 16px rgba(102,126,234,0.6)',
										},
									}}
								>
									Copiar Link
								</Button>
							</Stack>
						)}

						{/* Right Actions */}
						<Stack direction="row" spacing={1} alignItems="center">
							{/* Notifications */}
							<Tooltip title="Notificações">
								<IconButton onClick={handleOpenNotif}>
									<Badge badgeContent={dashboardData.stats.pendingQuestionnaires} color="error">
										<Notifications />
									</Badge>
								</IconButton>
							</Tooltip>

							{/* Settings - Desktop only */}
							{!isMobile && (
								<Tooltip title="Configurações">
									<IconButton onClick={() => ''}>
										<Settings />
									</IconButton>
								</Tooltip>
							)}

							<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

							{/* User Menu */}
							<Tooltip title="Minha conta">
								<Stack
									direction="row"
									spacing={1.5}
									alignItems="center"
									onClick={handleOpenUserMenu}
									sx={{
										cursor: 'pointer',
										px: 1,
										py: 0.5,
										borderRadius: 2,
										transition: 'all 0.2s',
										'&:hover': {
											bgcolor: 'action.hover',
										},
									}}
								>
									<Avatar
										src={user.photo}
										sx={{
											width: 36,
											height: 36,
											border: '2px solid',
											borderColor: 'primary.main',
										}}
									>
										{user.username[0]}
									</Avatar>
									{!isMobile && (
										<Box>
											<Typography variant="body2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
												{user.username}
											</Typography>
											<Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
												{user.specialty || 'Profissional'}
											</Typography>
										</Box>
									)}
								</Stack>
							</Tooltip>
						</Stack>
					</Stack>
				</Container>
			</Paper>

			{/* Mobile Navigation Drawer */}
			<Drawer
				anchor="left"
				open={mobileMenuOpen}
				onClose={handleMobileMenuToggle}
				PaperProps={{
					sx: {
						width: 280,
						bgcolor: 'background.default',
					},
				}}
			>
				<Box sx={{ p: 2 }}>
					{/* Header do Drawer */}
					<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Box
								sx={{
									width: 32,
									height: 32,
									borderRadius: 2,
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '1rem',
								}}
							>
								💚
							</Box>
							<Typography variant="h6" fontWeight="bold">
								Saúde Ativa
							</Typography>
						</Stack>
						<IconButton onClick={handleMobileMenuToggle} size="small">
							<Close />
						</IconButton>
					</Stack>

					<Divider sx={{ mb: 2 }} />

					{/* Menu Items */}
					<Stack spacing={1}>
						<Button
							fullWidth
							startIcon={<DashboardIcon />}
							onClick={handleMobileMenuToggle}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: 'primary.main',
								bgcolor: 'primary.lighter',
								fontWeight: 600,
								py: 1.5,
								px: 2,
								borderRadius: 2,
							}}
						>
							Dashboard
						</Button>

						<Button
							fullWidth
							startIcon={<People />}
							onClick={() => {
								''
								handleMobileMenuToggle();
							}}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: 'text.primary',
								fontWeight: 600,
								py: 1.5,
								px: 2,
								borderRadius: 2,
								'&:hover': {
									bgcolor: 'action.hover',
								},
							}}
						>
							Pacientes
						</Button>

						<Button
							fullWidth
							startIcon={<CalendarMonth />}
							onClick={() => {
								''
								handleMobileMenuToggle();
							}}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: 'text.primary',
								fontWeight: 600,
								py: 1.5,
								px: 2,
								borderRadius: 2,
								'&:hover': {
									bgcolor: 'action.hover',
								},
							}}
						>
							Agendamentos
						</Button>

						<Button
							fullWidth
							startIcon={<Assignment />}
							onClick={() => {
								''
								handleMobileMenuToggle();
							}}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: 'text.primary',
								fontWeight: 600,
								py: 1.5,
								px: 2,
								borderRadius: 2,
								'&:hover': {
									bgcolor: 'action.hover',
								},
							}}
						>
							Questionários
						</Button>

						<Button
							fullWidth
							variant="contained"
							startIcon={<ContentCopy />}
							onClick={copyQuestionnaireLink}
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								py: 1.5,
								px: 2,
								borderRadius: 2,
								boxShadow: '0 4px 12px rgba(102,126,234,0.4)',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								'&:hover': {
									boxShadow: '0 6px 16px rgba(102,126,234,0.6)',
								},
							}}
						>
							Copiar Link
						</Button>

						<Divider sx={{ my: 2 }} />

						<Button
							fullWidth
							startIcon={<Settings />}
							onClick={() => {
								'';
								handleMobileMenuToggle();
							}}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: 'text.primary',
								fontWeight: 600,
								py: 1.5,
								px: 2,
								borderRadius: 2,
								'&:hover': {
									bgcolor: 'action.hover',
								},
							}}
						>
							Configurações
						</Button>
					</Stack>
				</Box>
			</Drawer>

			{/* User Menu */}
			<Menu
				anchorEl={anchorElUser}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				PaperProps={{
					sx: {
						mt: 1.5,
						minWidth: 200,
						borderRadius: 2,
						boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
					},
				}}
			>
				<Box sx={{ px: 2, py: 1.5 }}>
					<Typography variant="subtitle2" fontWeight="bold">
						{user.username}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						{user.specialty || 'Profissional de Saúde'}
					</Typography>
				</Box>
				<Divider />
				<MenuItem onClick={() => {
					handleCloseUserMenu();
					'';
				}}>
					<ListItemIcon>
						<DashboardIcon fontSize="small" />
					</ListItemIcon>
					Dashboard
				</MenuItem>
				<MenuItem onClick={() => {
					handleCloseUserMenu();
					'';
				}}>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Configurações
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
					<ListItemIcon>
						<Logout fontSize="small" color="error" />
					</ListItemIcon>
					Sair
				</MenuItem>
			</Menu>

			{/* Notifications Menu */}
			<Menu
				anchorEl={anchorElNotif}
				open={Boolean(anchorElNotif)}
				onClose={handleCloseNotif}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				PaperProps={{
					sx: {
						mt: 1.5,
						width: 320,
						maxHeight: 400,
						borderRadius: 2,
						boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
					},
				}}
			>
				<Box sx={{ px: 2, py: 1.5 }}>
					<Typography variant="subtitle1" fontWeight="bold">
						Notificações
					</Typography>
				</Box>
				<Divider />
				{dashboardData.stats.pendingQuestionnaires > 0 ? (
					<MenuItem onClick={handleCloseNotif}>
						<Stack spacing={0.5}>
							<Typography variant="body2" fontWeight="bold">
								Questionários pendentes
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{dashboardData.stats.pendingQuestionnaires} questionário(s) aguardando resposta
							</Typography>
						</Stack>
					</MenuItem>
				) : (
					<Box sx={{ p: 4, textAlign: 'center' }}>
						<Typography color="text.secondary">Nenhuma notificação</Typography>
					</Box>
				)}
			</Menu>

			{/* MAIN CONTENT */}
			<Container maxWidth="xl" sx={{ py: 4 }}>
				{/* Stats Cards */}
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
									<Box>
										<Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
											Total de Clientes
										</Typography>
										<Typography variant="h3" fontWeight="bold">
											{dashboardData.stats.totalClients}
										</Typography>
									</Box>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: 2,
											bgcolor: 'rgba(255,255,255,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<People />
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #4FC3F7 0%, #4DB6AC 100%)',
								color: 'white',
								
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
									<Box>
										<Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
											Consultas Hoje
										</Typography>
										<Typography variant="h3" fontWeight="bold">
											{dashboardData.stats.todayAppointments}
										</Typography>
									</Box>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: 2,
											bgcolor: 'rgba(255,255,255,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<CalendarMonth />
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
								color: 'white',
								
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
									<Box>
										<Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
											Concluídas
										</Typography>
										<Typography variant="h3" fontWeight="bold">
											{dashboardData.stats.completedAppointments}
										</Typography>
									</Box>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: 2,
											bgcolor: 'rgba(255,255,255,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<CheckCircle />
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
								color: 'white',
								
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
									<Box>
										<Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
											Pendentes
										</Typography>
										<Typography variant="h3" fontWeight="bold">
											{dashboardData.stats.pendingAppointments}
										</Typography>
									</Box>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: 2,
											bgcolor: 'rgba(255,255,255,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Schedule />
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				<Grid container spacing={3}>
					{/* Status Pie Chart */}
					<Grid size={{ xs: 12, md: 4 }}>
						<Card sx={{  height: '100%' }}>
							<CardContent>
								<Typography variant="h6" fontWeight="bold" mb={2}>
									Status das Consultas
								</Typography>
								<Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<ResponsiveContainer>
										<PieChart>
											<Pie
												data={statusData}
												cx="50%"
												cy="50%"
												innerRadius={50}
												outerRadius={80}
												paddingAngle={5}
												dataKey="value"
											>
												{statusData.map((_, index) => (
													<Cell key={`cell-${index}`} fill={COLORS[index]} />
												))}
											</Pie>
											<RechartsTooltip />
										</PieChart>
									</ResponsiveContainer>
								</Box>
								<Stack spacing={1} mt={2}>
									{statusData.map((item, index) => (
										<Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
											<Stack direction="row" spacing={1} alignItems="center">
												<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index] }} />
												<Typography variant="body2">{item.name}</Typography>
											</Stack>
											<Typography variant="body2" fontWeight="bold">
												{item.value}
											</Typography>
										</Stack>
									))}
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					{/* Today's Appointments */}
					<Grid size={{ xs: 12, md: 8 }}>
						<Card sx={{  height: '100%' }}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h6" fontWeight="bold">
										Consultas de Hoje ({dashboardData.todayAppointments.length})
									</Typography>
									<Button
										size="small"
										onClick={() => ''}
									>
										Ver todas
									</Button>
								</Stack>

								{dashboardData.todayAppointments.length === 0 ? (
									<Box sx={{ textAlign: 'center', py: 6 }}>
										<Typography color="text.secondary">Nenhuma consulta hoje 🎉</Typography>
									</Box>
								) : (
									<Stack spacing={2}>
										{dashboardData.todayAppointments.slice(0, 4).map((apt) => (
											<Paper
												key={apt.id}
												sx={{
													p: 2,
													border: '1px solid',
													borderColor: 'divider',
													borderRadius: 2,
													'&:hover': {
														borderColor: 'primary.main',
														boxShadow: 1,
													},
													transition: 'all 0.2s',
													cursor: 'pointer',
												}}
											>
												<Stack direction="row" spacing={2} alignItems="center">
													<Avatar src={apt.client.photo} sx={{ width: 48, height: 48 }}>
														{apt.client.name[0]}
													</Avatar>
													<Box sx={{ flex: 1 }}>
														<Typography variant="subtitle2" fontWeight="bold">
															{apt.client.name}
														</Typography>
														<Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
															<Chip
																icon={<AccessTime sx={{ fontSize: 16 }} />}
																label={formatTime(apt.date)}
																size="small"
																variant="outlined"
															/>
															<Chip
																icon={apt.isOnline ? <VideoCall sx={{ fontSize: 16 }} /> : <LocationOn sx={{ fontSize: 16 }} />}
																label={apt.isOnline ? 'Online' : 'Presencial'}
																size="small"
																variant="outlined"
															/>
															<Chip
																label={apt.status}
																size="small"
																color={getStatusColor(apt.status)}
															/>
														</Stack>
													</Box>
													<IconButton size="small">
														<MoreVert />
													</IconButton>
												</Stack>
											</Paper>
										))}
									</Stack>
								)}
							</CardContent>
						</Card>
					</Grid>

					{/* Upcoming Appointments */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<Card sx={{ borderRadius: 3 }}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h6" fontWeight="bold">
										Próximos 7 Dias
									</Typography>
									<Button
										size="small"
										onClick={() => ''}
									>
										Ver todos
									</Button>
								</Stack>

								{dashboardData.upcomingAppointments.length === 0 ? (
									<Box sx={{ textAlign: 'center', py: 6 }}>
										<Typography color="text.secondary">
											Nenhuma consulta agendada nos próximos 7 dias
										</Typography>
									</Box>
								) : (
									<TableContainer>
										<Table size="small">
											<TableHead>
												<TableRow>
													<TableCell>Cliente</TableCell>
													<TableCell>Data/Hora</TableCell>
													<TableCell>Tipo</TableCell>
													<TableCell>Status</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{dashboardData.upcomingAppointments.slice(0, 6).map((apt) => (
													<TableRow
														key={apt.id}
														hover
														sx={{ cursor: 'pointer' }}
													>
														<TableCell>
															<Stack direction="row" spacing={1} alignItems="center">
																<Avatar src={apt.client.photo} sx={{ width: 32, height: 32 }}>
																	{apt.client.name[0]}
																</Avatar>
																<Typography variant="body2">{apt.client.name}</Typography>
															</Stack>
														</TableCell>
														<TableCell>
															<Typography variant="body2">{formatDate(apt.date)}</Typography>
														</TableCell>
														<TableCell>
															<Chip
																icon={apt.isOnline ? <VideoCall sx={{ fontSize: 14 }} /> : <LocationOn sx={{ fontSize: 14 }} />}
																label={apt.isOnline ? 'Online' : 'Presencial'}
																size="small"
																variant="outlined"
															/>
														</TableCell>
														<TableCell>
															<Chip
																label={apt.status}
																size="small"
																color={getStatusColor(apt.status)}
															/>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								)}
							</CardContent>
						</Card>
					</Grid>

					{/* Recent Clients */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<Card sx={{ borderRadius: 3 }}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h6" fontWeight="bold">
										Clientes Recentes
									</Typography>
									<Button
										size="small"
										onClick={() => ''}
									>
										Ver todos
									</Button>
								</Stack>

								{dashboardData.recentClients.length === 0 ? (
									<Box sx={{ textAlign: 'center', py: 6 }}>
										<Typography color="text.secondary">
											Nenhum cliente cadastrado
										</Typography>
									</Box>
								) : (
									<Stack spacing={2}>
										{dashboardData.recentClients.map((client, index) => (
											<Paper
												key={`${client.email}_${index}`}
												sx={{
													p: 2,
													border: '1px solid',
													borderColor: 'divider',
													borderRadius: 2,
													cursor: 'pointer',
													transition: 'all 0.2s',
													'&:hover': {
														borderColor: 'primary.main',
														boxShadow: 1,
													},
												}}
											>
												<Stack direction="row" spacing={2} alignItems="center">
													<Avatar src={client.photo} sx={{ width: 40, height: 40 }}>
														{client.name[0]}
													</Avatar>
													<Box sx={{ flex: 1 }}>
														<Typography variant="subtitle2" fontWeight="bold">
															{client.name}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															{client.phone || 'Sem telefone'}
														</Typography>
													</Box>
												</Stack>
											</Paper>
										))}
									</Stack>
								)}
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}