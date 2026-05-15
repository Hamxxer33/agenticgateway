(function () {
  function getScriptTag() {
    return document.currentScript || document.querySelector('script[src$="embed.js"]');
  }

  function truncateAddress(address) {
    return address && address.length > 10
      ? address.slice(0, 6) + '...' + address.slice(-4)
      : address;
  }

  function createPaymentWall(price, wallet, domain, facilitator) {
    const wall = document.createElement('div');
    wall.id = 'agw-payment-wall';
    wall.style.position = 'fixed';
    wall.style.top = '0';
    wall.style.left = '0';
    wall.style.width = '100%';
    wall.style.height = '100%';
    wall.style.zIndex = '999999';
    wall.style.background = '#0a0a0a';
    wall.style.color = '#ffffff';
    wall.style.display = 'flex';
    wall.style.alignItems = 'center';
    wall.style.justifyContent = 'center';
    wall.style.padding = '20px';
    wall.style.boxSizing = 'border-box';

    const card = document.createElement('div');
    card.style.maxWidth = '460px';
    card.style.width = '100%';
    card.style.borderRadius = '20px';
    card.style.padding = '32px';
    card.style.background = '#111111';
    card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.35)';
    card.style.fontFamily = 'Inter, system-ui, sans-serif';
    card.style.lineHeight = '1.5';

    const title = document.createElement('h1');
    title.textContent = 'Access requires payment';
    title.style.margin = '0 0 16px';
    title.style.fontSize = '28px';
    title.style.fontWeight = '700';

    const details = document.createElement('div');
    details.style.marginBottom = '24px';

    const priceLine = document.createElement('p');
    priceLine.textContent = 'Price: ' + price + ' USDC';
    priceLine.style.margin = '0 0 10px';
    priceLine.style.fontSize = '16px';

    const walletLine = document.createElement('p');
    walletLine.textContent = 'Owner wallet: ' + truncateAddress(wallet);
    walletLine.style.margin = '0';
    walletLine.style.fontSize = '16px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Paste txHash here';
    input.style.width = '100%';
    input.style.padding = '14px 16px';
    input.style.margin = '20px 0 16px';
    input.style.border = '1px solid #333';
    input.style.borderRadius = '12px';
    input.style.background = '#0f0f0f';
    input.style.color = '#fff';
    input.style.fontSize = '15px';

    const button = document.createElement('button');
    button.textContent = 'Verify Payment';
    button.style.width = '100%';
    button.style.padding = '14px 16px';
    button.style.border = 'none';
    button.style.borderRadius = '12px';
    button.style.background = '#2D3FE0';
    button.style.color = '#fff';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';

    const message = document.createElement('p');
    message.style.margin = '16px 0 0';
    message.style.color = '#cccccc';
    message.style.fontSize = '14px';
    message.textContent = 'Powered by Agentic Gateway';

    const errorText = document.createElement('p');
    errorText.style.margin = '12px 0 0';
    errorText.style.color = '#ff5f7a';
    errorText.style.fontSize = '14px';
    errorText.style.display = 'none';

    button.addEventListener('click', async function () {
      errorText.style.display = 'none';
      button.disabled = true;
      button.textContent = 'Verifying...';

      const txHash = input.value.trim();
      if (!txHash) {
        errorText.textContent = 'Enter a transaction hash.';
        errorText.style.display = 'block';
        button.disabled = false;
        button.textContent = 'Verify Payment';
        return;
      }

      try {
        const payload = { txHash, domain };
        const response = await fetch(facilitator.replace(/\/$/, '') + '/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok && result.token) {
          localStorage.setItem('agw_token', result.token);
          removePaymentWall();
          revealPage();
        } else {
          errorText.textContent = result.error || 'Payment verification failed.';
          errorText.style.display = 'block';
        }
      } catch (err) {
        errorText.textContent = 'Unable to verify payment. Try again.';
        errorText.style.display = 'block';
      } finally {
        button.disabled = false;
        button.textContent = 'Verify Payment';
      }
    });

    details.appendChild(priceLine);
    details.appendChild(walletLine);
    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(input);
    card.appendChild(button);
    card.appendChild(errorText);
    card.appendChild(message);
    wall.appendChild(card);
    return wall;
  }

  function blockPage() {
    document.body.style.display = 'none';
  }

  function revealPage() {
    document.body.style.display = '';
    const existing = document.getElementById('agw-payment-wall');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  }

  function removePaymentWall() {
    const wall = document.getElementById('agw-payment-wall');
    if (wall && wall.parentNode) {
      wall.parentNode.removeChild(wall);
    }
  }

  async function validateToken(token, facilitator) {
    if (!token) return false;
    try {
      const response = await fetch(facilitator.replace(/\/$/, '') + '/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      const result = await response.json();
      return result.valid === true;
    } catch (err) {
      return false;
    }
  }

  async function init() {
    document.body.style.display = 'none';

    const script = getScriptTag();
    if (!script) return;

    const price = script.dataset.price || '';
    const wallet = script.dataset.wallet || '';
    const domain = script.dataset.domain || window.location.hostname;
    const facilitator = script.dataset.facilitator || 'https://agenticgateway.onrender.com';

    if (!price || !wallet) return;

    const token = localStorage.getItem('agw_token');
    const tokenValid = await validateToken(token, facilitator);

    if (tokenValid) {
      revealPage();
      return;
    }

    localStorage.removeItem('agw_token');

    const wall = createPaymentWall(price, wallet, domain, facilitator);
    document.documentElement.appendChild(wall);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
