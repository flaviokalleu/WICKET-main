import React, { useState, useEffect, useRef, useContext, useCallback } from "react";

import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { green, grey } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";
import { List, Tooltip } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import toastError from "../../errors/toastError";
import { v4 as uuidv4 } from "uuid";

import GroupIcon from '@material-ui/icons/Group';
import ContactTag from "../ContactTag";
import ConnectionIcon from "../ConnectionIcon";
import AcceptTicketWithouSelectQueue from "../AcceptTicketWithoutQueueModal";
import TransferTicketModalCustom from "../TransferTicketModalCustom";
import ShowTicketOpen from "../ShowTicketOpenModal";
import { isNil } from "lodash";
import { toast } from "react-toastify";
import { Done, HighlightOff, Replay, SwapHoriz, MarkunreadMailboxTwoTone, Markunread } from "@material-ui/icons";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import { Avatar, Badge, ListItemAvatar, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    ticket: {
        position: "relative",
        backgroundColor: "#1a1a1a",
        borderBottom: "1px solid #333333",
        "&:hover": {
            backgroundColor: "#2a2a2a",
        },
        "&.selected": {
            backgroundColor: "#00d4aa",
            color: "#ffffff",
        },
    },

    pendingTicket: {
        cursor: "unset",
        backgroundColor: "#2a2a2a",
    },
    queueTag: {
        background: "linear-gradient(135deg, #374151, #1f2937)",
        color: "#ffffff",
        marginRight: 1,
        padding: "4px 8px",
        fontWeight: '600',
        borderRadius: 8,
        fontSize: "0.5em",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        border: "1px solid #4b5563"
    },
    noTicketsDiv: {
        display: "flex",
        height: "100px",
        margin: 40,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
    },
    newMessagesCount: {
        justifySelf: "flex-end",
        textAlign: "right",
        position: "relative",
        top: 0,
        color: "#00d4aa",
        fontWeight: "bold",
        marginRight: "10px",
        borderRadius: 0,
    },
    noTicketsText: {
        textAlign: "center",
        color: "#a0a0a0",
        fontSize: "14px",
        lineHeight: "1.4",
    },
    connectionTag: {
        background: "linear-gradient(135deg, #00d4aa, #00b894)",
        color: "#ffffff",
        marginRight: 1,
        padding: "4px 8px",
        fontWeight: '600',
        borderRadius: 8,
        fontSize: "0.6em",
        boxShadow: "0 2px 8px rgba(0, 212, 170, 0.3)",
        border: "none"
    },
    noTicketsTitle: {
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "600",
        margin: "0px",
        color: "#ffffff",
    },

    contactNameWrapper: {
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "5px",
        fontWeight: "bold",
        color: "#ffffff",
    },

    lastMessageTime: {
        justifySelf: "flex-end",
        textAlign: "right",
        position: "relative",
        top: -30,
        marginRight: "1px",
        color: "#a0a0a0",
    },

    lastMessageTimeUnread: {
        justifySelf: "flex-end",
        textAlign: "right",
        position: "relative",
        top: -30,
        color: "#00d4aa",
        fontWeight: "bold",
        marginRight: "1px",
    },

    closedBadge: {
        alignSelf: "center",
        justifySelf: "flex-end",
        marginRight: 32,
        marginLeft: "auto",
    },

    contactLastMessage: {
        paddingRight: "0%",
        marginLeft: "5px",
        color: "#a0a0a0",
    },

    contactLastMessageUnread: {
        paddingRight: 20,
        fontWeight: "bold",
        color: "#ffffff",
        width: "50%"
    },

    badgeStyle: {
        color: "white",
        backgroundColor: "#00d4aa",
        borderRadius: "8px",
        fontSize: "0.75rem",
        fontWeight: "600",
        boxShadow: "0 2px 8px rgba(0, 212, 170, 0.3)"
    },

    acceptButton: {
        position: "absolute",
        right: "1px",
        background: "linear-gradient(135deg, #00d4aa, #00b894)",
        color: "#ffffff",
        borderRadius: "12px",
        fontWeight: "600",
        textTransform: "none",
        boxShadow: "0 4px 12px rgba(0, 212, 170, 0.3)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
            background: "linear-gradient(135deg, #00b894, #009973)",
            boxShadow: "0 6px 16px rgba(0, 212, 170, 0.4)",
            transform: "translateY(-1px)"
        },
    },

    ticketQueueColor: {
        flex: "none",
        // width: "8px",
        height: "100%",
        position: "absolute",
        top: "0%",
        left: "0%",
    },

    ticketInfo: {
        position: "relative",
        top: -13
    },
    secondaryContentSecond: {
        display: 'flex',
        // marginBottom: 2,
        // marginLeft: "5px",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        flexDirection: "row",
        alignContent: "flex-start",
        // height: "10px"
    },
    ticketInfo1: {
        position: "relative",
        top: 13,
        right: 0
    },
    Radiusdot: {
        "& .MuiBadge-badge": {
            borderRadius: 2,
            position: "inherit",
            height: 16,
            margin: 2,
            padding: 3
        },
        "& .MuiBadge-anchorOriginTopRightRectangle": {
            transform: "scale(1) translate(0%, -40%)",
        },
    },
    connectionIcon: {
        marginRight: theme.spacing(1)
    }
}));

const TicketListItemCustom = ({ setTabOpen, ticket }) => {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [acceptTicketWithouSelectQueueOpen, setAcceptTicketWithouSelectQueueOpen] = useState(false);
    const [transferTicketModalOpen, setTransferTicketModalOpen] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [userTicketOpen, setUserTicketOpen] = useState("");
    const [queueTicketOpen, setQueueTicketOpen] = useState("");

    const { ticketId } = useParams();
    const isMounted = useRef(true);
    const { setCurrentTicket } = useContext(TicketsContext);
    const { user } = useContext(AuthContext);

    const { get: getSetting } = useCompanySettings();

    useEffect(() => {
        console.log("======== TicketListItemCustom ===========")
        console.log(ticket)
        console.log("=========================================")
    }, [ticket])

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleOpenAcceptTicketWithouSelectQueue = useCallback(() => {
        // console.log(ticket)
        setAcceptTicketWithouSelectQueueOpen(true);
    }, []);

    const handleCloseTicket = async (id) => {
        const setting = await getSetting(
            {
                "column": "requiredTag"
            }
        );

        if (setting.requiredTag === "enabled") {
            //verificar se tem uma tag   
            try {
                const contactTags = await api.get(`/contactTags/${ticket.contact.id}`);
                if (!contactTags.data.tags) {
                    toast.warning(i18n.t("messagesList.header.buttons.requiredTag"))
                } else {
                    await api.put(`/tickets/${id}`, {
                        status: "closed",
                        userId: user?.id || null,
                    });

                    if (isMounted.current) {
                        setLoading(false);
                    }

                    history.push(`/tickets/`);
                }
            } catch (err) {
                setLoading(false);
                toastError(err);
            }
        } else {
            setLoading(true);
            try {
                await api.put(`/tickets/${id}`, {
                    status: "closed",
                    userId: user?.id || null,
                });

            } catch (err) {
                setLoading(false);
                toastError(err);
            }
            if (isMounted.current) {
                setLoading(false);
            }

            history.push(`/tickets/`);
        }

    };

    const handleCloseIgnoreTicket = async (id) => {
        setLoading(true);
        try {
            await api.put(`/tickets/${id}`, {
                status: "closed",
                userId: user?.id || null,
                sendFarewellMessage: false,
                amountUsedBotQueues: 0
            });

        } catch (err) {
            setLoading(false);
            toastError(err);
        }
        if (isMounted.current) {
            setLoading(false);
        }

        history.push(`/tickets/`);
    };

    const truncate = (str, len) => {
        if (!isNil(str)) {
            if (str.length > len) {
                return str.substring(0, len) + "...";
            }
            return str;
        }
    };

    const handleCloseTransferTicketModal = useCallback(() => {
        if (isMounted.current) {
            setTransferTicketModalOpen(false);
        }
    }, []);

    const handleUnreadMessage = async () => {
        setLoading(true)
        const setUnread = await api.put(`/setunredmsg/${ticket.id}`, {
            id: ticket.id
        });
        setLoading(false);
        history.push(`/tickets/`);

        window.location.reload();
        
    }

    const handleOpenTransferModal = () => {
        setLoading(true)
        setTransferTicketModalOpen(true);
        if (isMounted.current) {
            setLoading(false);
        }
        handleSelectTicket(ticket);
        // history.push('/tickets');
        // setTimeout(() => {
        history.push(`/tickets/${ticket.uuid}`);
        // }, 0);
    }

    const handleAcepptTicket = async (id) => {
        setLoading(true);
        try {
            const otherTicket = await api.put(`/tickets/${id}`, ({
                status: ticket.isGroup && ticket.channel === 'whatsapp' ? "group" : "open",
                userId: user?.id,
            }));

            if (otherTicket.data.id !== ticket.id) {
                if (otherTicket.data.userId !== user?.id) {
                    setOpenAlert(true);
                    setUserTicketOpen(otherTicket.data.user.name);
                    setQueueTicketOpen(otherTicket.data.queue.name);
                } else {
                    setLoading(false);
                    setTabOpen(ticket.isGroup ? "group" : "open");
                    handleSelectTicket(otherTicket.data);
                    // history.push('/tickets');
                    // setTimeout(() => {
                    history.push(`/tickets/${otherTicket.uuid}`);
                    // }, 0);
                }
            } else {
                let setting;

                try {
                    setting = await getSetting({
                        "column": "sendGreetingAccepted"
                    });
                } catch (err) {
                    toastError(err);
                }

                if (setting.sendGreetingAccepted === "enabled" && (!ticket.isGroup || ticket.whatsapp?.groupAsTicket === "enabled")) {
                    handleSendMessage(ticket.id);
                }
                if (isMounted.current) {
                    setLoading(false);
                }

                setTabOpen(ticket.isGroup ? "group" : "open");
                handleSelectTicket(ticket);
                // history.push('/tickets');
                // setTimeout(() => {
                history.push(`/tickets/${ticket.uuid}`);
                // }, 0);
            }
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };


    const handleSendMessage = async (id) => {

        let setting;

        try {
            setting = await getSetting({
                "column": "greetingAcceptedMessage"
            })
        } catch (err) {
            toastError(err);
        }

        const msg = `${setting.greetingAcceptedMessage}`; //`{{ms}} *{{name}}*, ${i18n.t("mainDrawer.appBar.user.myName")} *${user?.name}* ${i18n.t("mainDrawer.appBar.user.continuity")}.`;
        const message = {
            read: 1,
            fromMe: true,
            mediaUrl: "",
            body: `${msg.trim()}`,
        };
        try {
            await api.post(`/messages/${id}`, message);
        } catch (err) {
            toastError(err);
        }
    };

    const handleCloseAlert = useCallback(() => {
        setOpenAlert(false);
        setLoading(false);
    }, []);

    const handleSelectTicket = (ticket) => {
        const code = uuidv4();
        const { id, uuid } = ticket;
        setCurrentTicket({ id, uuid, code });
    };

    return (
        <React.Fragment key={ticket.id}>
            {openAlert && (
                <ShowTicketOpen
                    isOpen={openAlert}
                    handleClose={handleCloseAlert}
                    user={userTicketOpen}
                    queue={queueTicketOpen}
                />
            )}
            {acceptTicketWithouSelectQueueOpen && (
                <AcceptTicketWithouSelectQueue
                    modalOpen={acceptTicketWithouSelectQueueOpen}
                    onClose={(e) => setAcceptTicketWithouSelectQueueOpen(false)}
                    ticketId={ticket.id}
                    ticket={ticket}
                />
            )}
            {transferTicketModalOpen && (
                <TransferTicketModalCustom
                    modalOpen={transferTicketModalOpen}
                    onClose={handleCloseTransferTicketModal}
                    ticketid={ticket.id}
                    ticket={ticket}
                />
            )}
            {/* <TicketMessagesDialog
                open={openTicketMessageDialog}
                handleClose={() => setOpenTicketMessageDialog(false)}
                ticketId={ticket.id}
            /> */}
            <ListItem
                button
                dense
                onClick={(e) => {
                    console.log('e', e)
                    const isCheckboxClicked = (e.target.tagName.toLowerCase() === 'input' && e.target.type === 'checkbox')
                        || (e.target.tagName.toLowerCase() === 'svg' && e.target.type === undefined)
                        || (e.target.tagName.toLowerCase() === 'path' && e.target.type === undefined);
                    // Se o clique foi no Checkbox, não execute handleSelectTicket

                    if (isCheckboxClicked) return;

                    handleSelectTicket(ticket);
                }}
                selected={ticketId && ticketId === ticket.uuid}
                className={clsx(classes.ticket, {
                    [classes.pendingTicket]: ticket.status === "pending",
                })}
            >
                <ListItemAvatar
                    style={{ marginLeft: "-15px" }}
                >
                    <Avatar
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                        }}
                        src={`${ticket?.contact?.urlPicture}`}

                    />
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={
                        <span className={classes.contactNameWrapper}>
                            <Typography
                                noWrap
                                component="span"
                                variant="body2"
                            // color="textPrimary"
                            >
                                {ticket.isGroup && ticket.channel === "whatsapp" && <GroupIcon fontSize="small" style={{ color: grey[700], marginBottom: '-1px', marginLeft: '5px' }} />} &nbsp;
                                {ticket.channel && <ConnectionIcon width="20" height="20" className={classes.connectionIcon} connectionType={ticket.channel} />} &nbsp;
                                {truncate(ticket.contact?.name, 60)}
                                {/* {profile === "admin"  && ( */}
                                {/* <Tooltip title="Espiar Conversa">
                                        <VisibilityIcon
                                            onClick={() => setOpenTicketMessageDialog(true)}
                                            fontSize="small"
                                            style={{
                                                color: blue[700],
                                                cursor: "pointer",
                                                marginLeft: 10,
                                                verticalAlign: "middle"
                                            }}
                                        />
                                    </Tooltip> */}
                                {/* )} */}
                            </Typography>
                            {/* <ListItemSecondaryAction>
                                <Box className={classes.ticketInfo1}>{renderTicketInfo()}</Box>
                            </ListItemSecondaryAction> */}
                        </span>
                    }
                    secondary={
                        <span className={classes.contactNameWrapper}>

                            <Typography
                                className={Number(ticket.unreadMessages) > 0 ? classes.contactLastMessageUnread : classes.contactLastMessage}
                                noWrap
                                component="span"
                                variant="body2"
                            // color="textSecondary"
                            // style={console.log('ticket.lastMessage', ticket.lastMessage)}
                            >
                                {ticket.lastMessage ? (
                                    <>
                                        {ticket.lastMessage.includes('fb.me') ? (
                        <MarkdownWrapper>Clique de Anúncio</MarkdownWrapper> //Clique de Anúncio adicionado
                      ) : ticket.lastMessage.includes('data:image/png;base64') ?
                                            <MarkdownWrapper>Localização</MarkdownWrapper> :
                                            <> {ticket.lastMessage.includes('BEGIN:VCARD') ?
                                                <MarkdownWrapper>Contato</MarkdownWrapper> :
                                                <MarkdownWrapper>{truncate(ticket.lastMessage, 40)}</MarkdownWrapper>}
                                            </>
                                        }
                                    </>
                                ) : (
                                    <br />
                                )}
                                <span className={classes.secondaryContentSecond} >
                                    {ticket?.whatsapp ? (
                                        <Badge 
                                            className={classes.connectionTag} 
                                            style={{ 
                                                background: ticket.channel === "whatsapp" 
                                                    ? "linear-gradient(135deg, #25D366, #1DA851)" 
                                                    : ticket.channel === "facebook" 
                                                        ? "linear-gradient(135deg, #4267B2, #365899)" 
                                                        : "linear-gradient(135deg, #E1306C, #C42D5C)",
                                                boxShadow: `0 2px 8px ${ticket.channel === "whatsapp" 
                                                    ? "rgba(37, 211, 102, 0.3)" 
                                                    : ticket.channel === "facebook" 
                                                        ? "rgba(66, 103, 178, 0.3)" 
                                                        : "rgba(225, 48, 108, 0.3)"}`
                                            }}
                                        >
                                            {ticket.whatsapp?.name.toUpperCase()}
                                        </Badge>
                                    ) : <br></br>}
                                    {<Badge 
                                        style={{ 
                                            background: ticket.queue?.color 
                                                ? `linear-gradient(135deg, ${ticket.queue.color}, ${ticket.queue.color}dd)` 
                                                : "linear-gradient(135deg, #db6565, #c53030)",
                                            boxShadow: `0 2px 8px ${ticket.queue?.color ? `${ticket.queue.color}40` : "rgba(219, 101, 101, 0.3)"}`
                                        }} 
                                        className={classes.connectionTag}
                                    >
                                        {ticket.queueId ? ticket.queue?.name.toUpperCase() : ticket.status === "lgpd" ? "LGPD" : "SEM FILA"}
                                    </Badge>}
                                    {ticket?.user && (
                                        <Badge 
                                            style={{ 
                                                background: "linear-gradient(135deg, #1f2937, #111827)",
                                                boxShadow: "0 2px 8px rgba(31, 41, 55, 0.3)"
                                            }} 
                                            className={classes.connectionTag}
                                        >
                                            {ticket.user?.name.toUpperCase()}
                                        </Badge>
                                    )}
                                </span>
                                <span className={classes.secondaryContentSecond} >
                                    {
                                        ticket.tags?.map((tag) => {
                                            return (
                                                <ContactTag tag={tag} key={`ticket-contact-tag-${ticket.id}-${tag.id}`} />
                                            );
                                        })
                                    }
                                </span>
                            </Typography>

                            <Badge
                                className={classes.newMessagesCount}
                                badgeContent={ticket.unreadMessages}
                                classes={{
                                    badge: classes.badgeStyle,
                                }}
                            />
                        </span>
                    }

                />
                <ListItemSecondaryAction>
                    {ticket.lastMessage && (
                        <>

                            <Typography
                                className={Number(ticket.unreadMessages) > 0 ? classes.lastMessageTimeUnread : classes.lastMessageTime}
                                component="span"
                                variant="body2"
                            // color="textSecondary"
                            >

                                {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                                    <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                                ) : (
                                    <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                                )}
                            </Typography>

                            <br />

                        </>
                    )}

                </ListItemSecondaryAction>
<ListItemSecondaryAction>
  <div style={{ 
    display: "flex", 
    gap: "6px", 
    flexWrap: "wrap", 
    alignItems: "center",
    padding: "8px 0",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: "4px",
      padding: "4px 0"
    }
  }}>
    {/* Botão de Aceitar Ticket Sem Fila */}
    {(ticket.status === "pending" && !ticket.queueId) && (
      <Tooltip title="Aceitar ticket sem fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #4ade80, #22c55e)",
            color: "#ffffff",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            minWidth: "36px",
            height: "36px",
            '&:hover': {
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 6px 16px rgba(34, 197, 94, 0.4)",
              transform: "translateY(-1px)"
            },
            '&:active': {
              transform: "translateY(0)"
            }
          }}
          size="small"
          loading={loading}
          onClick={handleOpenAcceptTicketWithouSelectQueue}
        >
          <Done style={{ fontSize: "18px" }} />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Aceitar Ticket Com Fila */}
    {(ticket.status === "pending" && ticket.queueId) && (
      <Tooltip title="Aceitar ticket com fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#ffffff",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            minWidth: "36px",
            height: "36px",
            '&:hover': {
              background: "linear-gradient(135deg, #d97706, #b45309)",
              boxShadow: "0 6px 16px rgba(245, 158, 11, 0.4)",
              transform: "translateY(-1px)"
            },
            '&:active': {
              transform: "translateY(0)"
            }
          }}
          size="small"
          loading={loading}
          onClick={() => handleAcepptTicket(ticket.id)}
        >
          <Done style={{ fontSize: "18px" }} />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Transferir */}
    {(["pending", "open", "group"].includes(ticket.status)) && (
      <Tooltip title="Transferir ticket" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#ffffff",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            minWidth: "36px",
            height: "36px",
            '&:hover': {
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
              transform: "translateY(-1px)"
            },
            '&:active': {
              transform: "translateY(0)"
            }
          }}
          size="small"
          loading={loading}
          onClick={handleOpenTransferModal}
        >
          <SwapHoriz style={{ fontSize: "18px" }} />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Fechar Ticket */}
    {(["open", "group"].includes(ticket.status)) && (
      <Tooltip title="Fechar ticket" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#ffffff",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            minWidth: "36px",
            height: "36px",
            '&:hover': {
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              boxShadow: "0 6px 16px rgba(239, 68, 68, 0.4)",
              transform: "translateY(-1px)"
            },
            '&:active': {
              transform: "translateY(0)"
            }
          }}
          size="small"
          loading={loading}
          onClick={() => handleCloseTicket(ticket.id)}
        >
          <HighlightOff style={{ fontSize: "18px" }} />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Ignorar Ticket */}
    {(["pending", "lgpd"].includes(ticket.status) && (user.userClosePendingTicket === "enabled" || user.profile === "admin")) && (
      <Tooltip title="Ignorar ticket" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #6b7280, #4b5563)",
            color: "#ffffff",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(107, 114, 128, 0.3)",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            minWidth: "36px",
            height: "36px",
            '&:hover': {
              background: "linear-gradient(135deg, #4b5563, #374151)",
              boxShadow: "0 6px 16px rgba(107, 114, 128, 0.4)",
              transform: "translateY(-1px)"
            },
            '&:active': {
              transform: "translateY(0)"
            }
          }}
          size="small"
          loading={loading}
          onClick={() => handleCloseIgnoreTicket(ticket.id)}
        >
          <HighlightOff style={{ fontSize: "18px" }} />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Reabrir Ticket (Sem Fila) */}
    {(ticket.status === "closed" && !ticket.queueId) && (
      <Tooltip title="Reabrir ticket sem fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            color: "#ffffff",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            minWidth: "36px",
            height: "36px",
            '&:hover': {
              background: "linear-gradient(135deg, #0891b2, #0e7490)",
              boxShadow: "0 6px 16px rgba(6, 182, 212, 0.4)",
              transform: "translateY(-1px)"
            },
            '&:active': {
              transform: "translateY(0)"
            }
          }}
          size="small"
          loading={loading}
          onClick={handleOpenAcceptTicketWithouSelectQueue}
        >
          <Replay style={{ fontSize: "18px" }} />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Reabrir Ticket (Com Fila) */}
    {(ticket.status === "closed" && ticket.queueId) && (
      <Tooltip title="Reabrir ticket com fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            color: "#ffffff",
            padding: "10px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            minWidth: "36px",
            height: "36px",
            '&:hover': {
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 6px 16px rgba(139, 92, 246, 0.4)",
              transform: "translateY(-1px)"
            },
            '&:active': {
              transform: "translateY(0)"
            }
          }}
          size="small"
          loading={loading}
          onClick={() => handleAcepptTicket(ticket.id)}
        >
          <Replay style={{ fontSize: "18px" }} />
        </ButtonWithSpinner>
      </Tooltip>
    )}
  </div>
</ListItemSecondaryAction>
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
        </React.Fragment>
    );
};

export default TicketListItemCustom;