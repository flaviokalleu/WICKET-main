import React, { useContext, useState, useEffect } from "react";
import { 
  Phone, 
  Clock, 
  CheckCircle, 
  Users, 
  UserCheck, 
  UserPlus, 
  MessageSquare, 
  Send, 
  Timer, 
  Hourglass,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Download
} from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "react-toastify";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray, isEmpty } from "lodash";
import moment from "moment";
import { AuthContext } from "../../context/Auth/AuthContext";
import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import ChatsUser from "./ChartsUser";
import ChartDonut from "./ChartDonut";
import Filters from "./Filters";
import { i18n } from "../../translate/i18n";
import ForbiddenPage from "../../components/ForbiddenPage";
import { ChartsDate } from "./ChartsDate";
import "../../styles/dashboardTheme.css";

const Dashboard = () => {
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [dateStartTicket, setDateStartTicket] = useState(moment().startOf('month').format("YYYY-MM-DD"));
  const [dateEndTicket, setDateEndTicket] = useState(moment().format("YYYY-MM-DD"));
  const [queueTicket, setQueueTicket] = useState(false);
  const [fetchDataFilter, setFetchDataFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();
  const { user } = useContext(AuthContext);

  // State for previous period data to calculate trends
  const [previousCounters, setPreviousCounters] = useState({});

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let nowIni = `${year}-${month < 10 ? `0${month}` : `${month}`}-01`;
  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;

  const exportarGridParaExcel = () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById('grid-attendants'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RelatorioDeAtendentes');
    XLSX.writeFile(wb, 'relatorio-de-atendentes.xlsx');
  };

  var userQueueIds = user.queues?.map((q) => q.id) || [];

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
      await fetchPreviousData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataFilter]);

  async function fetchData() {
    setLoading(true);
    let params = {};

    if (!isEmpty(dateStartTicket) && moment(dateStartTicket).isValid()) {
      params = { ...params, date_from: moment(dateStartTicket).format("YYYY-MM-DD") };
    }
    if (!isEmpty(dateEndTicket) && moment(dateEndTicket).isValid()) {
      params = { ...params, date_to: moment(dateEndTicket).format("YYYY-MM-DD") };
    }
    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }

    try {
      const data = await find(params);
      setCounters(data.counters || {});
      setAttendants(isArray(data.attendants) ? data.attendants : []);
    } catch (error) {
      toast.error("Erro ao carregar dados do dashboard");
      console.error(error);
    }
    setLoading(false);
  }

  async function fetchPreviousData() {
    // Fetch data for the previous period to calculate trends
    let previousParams = {
      date_from: moment(dateStartTicket).subtract(1, 'month').format("YYYY-MM-DD"),
      date_to: moment(dateEndTicket).subtract(1, 'month').format("YYYY-MM-DD"),
    };

    try {
      const data = await find(previousParams);
      setPreviousCounters(data.counters || {});
    } catch (error) {
      console.error("Erro ao carregar dados do período anterior", error);
    }
  }

  const calculateTrend = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0) return { trend: null, trendValue: 0 };
    const percentage = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
    return {
      trend: percentage >= 0 ? 'up' : 'down',
      trendValue: Math.abs(percentage),
    };
  };

  const GetUsers = () => {
    const userOnline = attendants.filter(user => user.online === true).length;
    return userOnline;
  };

  const GetContacts = (all) => {
    const props = all ? {} : { dateStart: dateStartTicket, dateEnd: dateEndTicket };
    const { count } = useContacts(props);
    return count || 0;
  };

  const GetMessages = (all, fromMe) => {
    const props = all
      ? { fromMe }
      : { fromMe, dateStart: dateStartTicket, dateEnd: dateEndTicket };
    const { count } = useMessages(props);
    return count || 0;
  };

  function formatTime(minutes) {
    return minutes
      ? moment().startOf("day").add(minutes, "minutes").format("HH[h] mm[m]")
      : "N/A";
  }

  function toggleShowFilter() {
    setShowFilter(!showFilter);
  }

  const MetricCard = ({ title, value, icon: Icon, bgColor, metricKey }) => {
    const { trend, trendValue } = metricKey
      ? calculateTrend(counters[metricKey] || 0, previousCounters[metricKey] || 0)
      : { trend: null, trendValue: 0 };

    return (
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-200 hover:border-teal-500 transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-300 uppercase tracking-wide mb-2">
              {title}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">
                {value}
              </p>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {user.profile === "user" && user.showDashboard === "disabled" ? (
        <ForbiddenPage />
      ) : (
        <div className="min-h-screen bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-300 mt-1">Acompanhe suas métricas em tempo real</p>
              </div>
              <button
                onClick={toggleShowFilter}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
            </div>

            {/* Filters */}
            {showFilter && (
              <div className="mb-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                <Filters
                  setDateStartTicket={setDateStartTicket}
                  setDateEndTicket={setDateEndTicket}
                  dateStartTicket={dateStartTicket}
                  dateEndTicket={dateEndTicket}
                  setQueueTicket={setQueueTicket}
                  queueTicket={queueTicket}
                  fetchData={setFetchDataFilter}
                />
              </div>
            )}

            {/* Indicadores Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Indicadores</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCard
                  title={i18n.t("dashboard.cards.inAttendance")}
                  value={counters.supportHappening || 0}
                  icon={Phone}
                  bgColor="bg-blue-500"
                  metricKey="supportHappening"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.waiting")}
                  value={counters.supportPending || 0}
                  icon={Hourglass}
                  bgColor="bg-yellow-500"
                  metricKey="supportPending"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.finalized")}
                  value={counters.supportFinished || 0}
                  icon={CheckCircle}
                  bgColor="bg-green-500"
                  metricKey="supportFinished"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.groups")}
                  value={counters.supportGroups || 0}
                  icon={Users}
                  bgColor="bg-purple-500"
                  metricKey="supportGroups"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.activeAttendants")}
                  value={`${GetUsers()}/${attendants.length}`}
                  icon={UserCheck}
                  bgColor="bg-indigo-500"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.newContacts")}
                  value={counters.leads || 0}
                  icon={UserPlus}
                  bgColor="bg-orange-500"
                  metricKey="leads"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.totalReceivedMessages")}
                  value={`${GetMessages(false, false)}/${GetMessages(true, false)}`}
                  icon={MessageSquare}
                  bgColor="bg-gray-500"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.totalSentMessages")}
                  value={`${GetMessages(false, true)}/${GetMessages(true, true)}`}
                  icon={Send}
                  bgColor="bg-green-600"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.averageServiceTime")}
                  value={formatTime(counters.avgSupportTime)}
                  icon={Clock}
                  bgColor="bg-amber-500"
                  metricKey="avgSupportTime"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.averageWaitingTime")}
                  value={formatTime(counters.avgWaitTime)}
                  icon={Timer}
                  bgColor="bg-red-500"
                  metricKey="avgWaitTime"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.activeTickets")}
                  value={counters.activeTickets}
                  icon={TrendingUp}
                  bgColor="bg-red-600"
                  metricKey="activeTickets"
                />
                <MetricCard
                  title={i18n.t("dashboard.cards.passiveTickets")}
                  value={counters.passiveTickets}
                  icon={TrendingDown}
                  bgColor="bg-green-600"
                  metricKey="passiveTickets"
                />
              </div>
            </div>

            {/* NPS Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">NPS</h2>
              <div className="space-y-6">
                {/* NPS Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                    <ChartDonut
                      data={[
                        `{'name': 'Promotores', 'value': ${counters.npsPromotersPerc || 0}}`,
                        `{'name': 'Detratores', 'value': ${counters.npsDetractorsPerc || 0}}`,
                        `{'name': 'Neutros', 'value': ${counters.npsPassivePerc || 0}}`
                      ]}
                      value={counters.npsScore || 0}
                      title="Score"
                      color={(parseInt(counters.npsPromotersPerc || 0) + parseInt(counters.npsDetractorsPerc || 0) + parseInt(counters.npsPassivePerc || 0)) === 0 ? ["#918F94"] : ["#2EA85A", "#F73A2C", "#F7EC2C"]}
                    />
                  </div>
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                    <ChartDonut
                      title={i18n.t("dashboard.assessments.prosecutors")}
                      value={counters.npsPromotersPerc || 0}
                      data={[`{'name': 'Promotores', 'value': 100}`]}
                      color={["#2EA85A"]}
                    />
                  </div>
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                    <ChartDonut
                      data={[`{'name': 'Neutros', 'value': 100}`]}
                      title={i18n.t("dashboard.assessments.neutral")}
                      value={counters.npsPassivePerc || 0}
                      color={["#F7EC2C"]}
                    />
                  </div>
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                    <ChartDonut
                      data={[`{'name': 'Detratores', 'value': 100}`]}
                      title={i18n.t("dashboard.assessments.detractors")}
                      value={counters.npsDetractorsPerc || 0}
                      color={["#F73A2C"]}
                    />
                  </div>
                </div>

                {/* NPS Summary */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Resumo das Avaliações</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{counters.waitRating || 0}</p>
                      <p className="text-sm text-gray-300">{i18n.t("dashboard.assessments.callsWaitRating")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{counters.withoutRating || 0}</p>
                      <p className="text-sm text-gray-300">{i18n.t("dashboard.assessments.callsWithoutRating")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{counters.withRating || 0}</p>
                      <p className="text-sm text-gray-300">{i18n.t("dashboard.assessments.ratedCalls")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {Number(counters.percRating / 100 || 0).toLocaleString(undefined, { style: 'percent' })}
                      </p>
                      <p className="text-sm text-gray-300">{i18n.t("dashboard.assessments.evaluationIndex")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendants Section */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Atendentes</h2>
              <div className="space-y-6">
                {/* Export Button */}
                <div className="flex justify-end">
                  <button
                    onClick={exportarGridParaExcel}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar para Excel
                  </button>
                </div>

                {/* Attendants Table */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700" id="grid-attendants">
                  {attendants.length ? (
                    <TableAttendantsStatus
                      attendants={attendants}
                      loading={loading}
                    />
                  ) : (
                    <div className="p-8 text-center text-gray-300">
                      Nenhum atendente encontrado
                    </div>
                  )}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                    <ChatsUser />
                  </div>
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                    <ChartsDate />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;