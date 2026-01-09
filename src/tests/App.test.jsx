import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';

//game
describe('Game loop test for start img, start button, cancel button, exit button', () => {
  it('img click to start/cancel buttons to exit button to main page does this clicks makes the right route?: ', async() => {
    const user = userEvent.setup();

    //mock test environment for music play().then
    Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value: ()=>Promise.resolve(), //lie that "i played it"
    });

    Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      writable: true,
      value: ()=>{},
    });
    render(
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    );

    //both at anasayfa.jsx
    const testStartGameImg = screen.getByAltText(/start the game img/i);
    const parentOftestStartGameImg = testStartGameImg.closest('button');
    await user.click(parentOftestStartGameImg);
    expect(parentOftestStartGameImg).not.toBeVisible();
    const testStartGameButton = await screen.findByText(/Oyuna Başla!/i, {}, {timeout: 8000});
    const testCancelGameButton = await screen.findByText(/Çık/i, {}, {timeout: 8000})
    await user.click(testStartGameButton);
    expect(testCancelGameButton).not.toBeVisible();
    expect(testCancelGameButton).not.toBeVisible();
    
    //at game.jsx
    const testExitGameButton = await screen.findByText('❌');
    expect(testExitGameButton).toBeInTheDocument();

    await user.click(testExitGameButton);

    await waitFor(()=>{
      expect(screen.queryByText('❌')).not.toBeVisible();
    });
  }, 10000);
});

//menu
describe('typewriter sound effect and music controls', ()=>{
  it('do music and typewriter effect work properly at menu?', async ()=>{
    const user = userEvent.setup();

    //spyOn
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, 'play');

    render(
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    );

    const testStartGameImg = screen.getByAltText(/start the game img/i);
    const parentOftestStartGameImg = testStartGameImg.closest('button');
    await user.click(parentOftestStartGameImg);
    const testStartGameButton = await screen.findByText(/Oyuna Başla!/i, {}, {timeout: 8000});
    await user.click(testStartGameButton);


    await waitFor(()=>{
      expect(playSpy).toHaveBeenCalled();
    });
  }, 10000)
})