// Project Name: Thronestead©
// File Name: notifications.js
// Version 6.14.2025.21.12
// Developer: Codex

import { supabase } from './supabaseClient.js';
import { showToast } from './utils.js';

const feed = document.getElementById('notification-feed');
const filterInput = document.getElementById('notification-filter');
const markAllBtn = document.getElementById('mark-all-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

let currentNotifications = [];

async function fetchNotifications() {
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch error:', error);
    showToast('Failed to load notifications');
    return;
  }

  currentNotifications = data;
  renderNotifications(currentNotifications);
}

function renderNotifications(data) {
  feed.innerHTML = '';

  if (!data.length) {
    feed.innerHTML = '<p class="no-notifications">No notifications available.</p>';
    return;
  }

  for (const n of data) {
    const card = document.createElement('div');
    card.classList.add('notification-card');
    card.setAttribute('aria-label', 'notification card');
    if (!n.is_read) card.classList.add('unread');

    card.innerHTML = `
      <div class="notification-header">
        <strong>${n.title}</strong>
        <span class="priority-tag ${n.priority}">${n.priority}</span>
      </div>
      <p class="notification-body">${n.message}</p>
      <div class="notification-footer">
        <small>${new Date(n.created_at).toLocaleString()}</small>
        ${n.link_action ? `<a href="${n.link_action}" class="notification-link">View</a>` : ''}
      </div>
    `;

    card.addEventListener('click', () => markAsRead(n.notification_id));
    feed.appendChild(card);
  }
}

async function markAsRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('notification_id', notificationId);

  if (error) {
    console.error('Mark read failed:', error);
    showToast('Could not update notification');
  }
  fetchNotifications();
}

markAllBtn.addEventListener('click', async () => {
  const user = await supabase.auth.getUser();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.data.user.id);

  if (error) {
    console.error('Mark all failed:', error);
    showToast('Failed to mark all read');
  }
  fetchNotifications();
});

clearAllBtn.addEventListener('click', async () => {
  const user = await supabase.auth.getUser();
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', user.data.user.id);

  if (error) {
    console.error('Clear failed:', error);
    showToast('Failed to clear notifications');
  }
  fetchNotifications();
});

filterInput.addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = currentNotifications.filter(n =>
    n.title.toLowerCase().includes(keyword) || n.message.toLowerCase().includes(keyword)
  );
  renderNotifications(filtered);
});

supabase
  .channel('notification-updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
    fetchNotifications();
  })
  .subscribe();

fetchNotifications();
