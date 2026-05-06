import { api } from './client';

export interface Requirements {
  agent_id: string;
  requirements_text: string | null;
  call_direction: string;
  persona_name: string | null;
  persona_style: string | null;
  multilingual: boolean;
  supported_language_ids: number[];
  agent_flow_status: string;
  prompt_compile?: string | null;
}

export async function getRequirements(agentId: string): Promise<Requirements> {
  return api<Requirements>(`/v1/agents/${agentId}/requirements`);
}

export async function saveRequirements(agentId: string, body: {
  requirements_text: string;
  call_direction?: 'inbound' | 'outbound' | 'both';
  persona_name?: string;
  persona_style?: string;
  multilingual?: boolean;
  supported_language_codes?: string[];
}): Promise<Requirements> {
  return api<Requirements>(`/v1/agents/${agentId}/requirements`, {
    method: 'POST',
    body: { call_direction: 'inbound', multilingual: false, supported_language_codes: [], ...body },
  });
}
