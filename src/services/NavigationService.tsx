// src/services/NavigationService.tsx

import type { NavigateFunction, Location, To } from "react-router-dom";

type NavigationOptions = {
  replace?: boolean;
  state?: any;
  // Suporte futuro para scroll, animações, etc
};

class NavigationService {
  private static navigateFn: NavigateFunction | null = null;
  private static locationObj: Location | null = null;

  /**
   * Registra o hook de navegação do React Router.
   * Deve ser chamado 1x no App (logo no início).
   */
  public static setNavigate(navigate: NavigateFunction, location: Location) {
    NavigationService.navigateFn = navigate;
    NavigationService.locationObj = location;
  }

  /**
   * Navega para a rota desejada.
   * @param to string | To (igual ao useNavigate)
   * @param options NavigationOptions
   */
  public static go(to: To, options: NavigationOptions = {}) {
    if (NavigationService.navigateFn) {
      NavigationService.navigateFn(to, options);
    } else {
      // fallback seguro (em produção quase nunca ocorre)
      if (typeof to === "string") {
        if (options.replace) {
          window.location.replace(to);
        } else {
          window.location.href = to;
        }
      }
    }
  }

  /**
   * Retorna a última localização conhecida do Router.
   */
  public static getLocation(): Location | null {
    return NavigationService.locationObj;
  }

  /**
   * Verifica se já está em determinada rota.
   */
  public static isAt(path: string): boolean {
    return (
      !!NavigationService.locationObj &&
      NavigationService.locationObj.pathname === path
    );
  }
}

export default NavigationService;
